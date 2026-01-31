/**
 * Stack Pulse Edge Function
 * Solo Stack Method™ — Phase 3 Implementation
 * 
 * INTENT (Dev Notes):
 * This function serves as the primary ingestion endpoint for Stack Pulse.
 * It receives dependency update notifications from external sources (registries,
 * webhooks, manual pushes) and stores them in the stack_pulse_updates table.
 * 
 * KEY DESIGN DECISIONS:
 * 1. Dedupe-first: We generate a unique key to prevent duplicate entries
 * 2. Idempotent: Same payload can be pushed multiple times safely
 * 3. Fail-safe: One bad request won't crash the function
 * 
 * AUTHENTICATION:
 * Global mode uses a shared secret (STACK_PULSE_SECRET) for server-to-server auth.
 * This is NOT user auth — it's for trusted ingestion sources only.
 * 
 * TODO: Add user-scoped mode for personalized dependency tracking
 * TODO: Add severity classification based on semver analysis
 * TODO: Add rate limiting per source
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for browser-based testing (optional)
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UpdatePayload {
    tool_name: string;
    version: string;
    registry?: string;  // defaults to "unknown" if not provided
  metadata?: Record<string, unknown>;
}

interface SuccessResponse {
    ok: true;
    duplicate: boolean;
    dedupe_key: string;
}

interface ErrorResponse {
    ok: false;
    error: string;
    code: number;
}

type ApiResponse = SuccessResponse | ErrorResponse;

/**
 * Generate dedupe_key from payload components.
 * 
 * WHY THIS FORMAT:
 * The key format {registry}:{tool_name}:{version} ensures that:
 * - Same tool from different registries are tracked separately (npm:lodash vs pypi:lodash)
 * - Same version detected multiple times is stored only once
 * - Keys are human-readable for debugging
 */
function generateDedupeKey(registry: string, toolName: string, version: string): string {
    return `${registry}:${toolName}:${version}`;
}

/**
 * Validate the incoming payload has required fields.
 * Returns null if valid, or an error message if invalid.
 */
function validatePayload(payload: unknown): string | null {
    if (!payload || typeof payload !== "object") {
          return "Request body must be a JSON object";
    }

  const p = payload as Record<string, unknown>;

  if (!p.tool_name || typeof p.tool_name !== "string") {
        return "Missing or invalid 'tool_name' field (string required)";
  }

  if (!p.version || typeof p.version !== "string") {
        return "Missing or invalid 'version' field (string required)";
  }

  return null;
}

serve(async (req: Request): Promise<Response> => {
    // Handle CORS preflight
        if (req.method === "OPTIONS") {
              return new Response("ok", { headers: corsHeaders });
        }

        // Only accept POST
        if (req.method !== "POST") {
              const response: ErrorResponse = {
                      ok: false,
                      error: "Method not allowed. Use POST.",
                      code: 405,
              };
              return new Response(JSON.stringify(response), {
                      status: 405,
                      headers: { ...corsHeaders, "Content-Type": "application/json" },
              });
        }

        // ============================================================
        // AUTHENTICATION
        // Verify Bearer token matches STACK_PULSE_SECRET
        // This protects the endpoint from unauthorized writes
        // ============================================================
        const authHeader = req.headers.get("Authorization");
    const expectedSecret = Deno.env.get("STACK_PULSE_SECRET");

        if (!expectedSecret) {
              // Server misconfiguration — secret not set
      console.error("STACK_PULSE_SECRET not configured");
              const response: ErrorResponse = {
                      ok: false,
                      error: "Server configuration error",
                      code: 500,
              };
              return new Response(JSON.stringify(response), {
                      status: 500,
                      headers: { ...corsHeaders, "Content-Type": "application/json" },
              });
        }

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
              const response: ErrorResponse = {
                      ok: false,
                      error: "Missing or invalid Authorization header. Use: Bearer <token>",
                      code: 401,
              };
              return new Response(JSON.stringify(response), {
                      status: 401,
                      headers: { ...corsHeaders, "Content-Type": "application/json" },
              });
        }

        const providedToken = authHeader.replace("Bearer ", "");
    if (providedToken !== expectedSecret) {
          const response: ErrorResponse = {
                  ok: false,
                  error: "Invalid authorization token",
                  code: 401,
          };
          return new Response(JSON.stringify(response), {
                  status: 401,
                  headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
    }

        // ============================================================
        // PARSE & VALIDATE PAYLOAD
        // ============================================================
        let payload: UpdatePayload;

        try {
              payload = await req.json();
        } catch {
              const response: ErrorResponse = {
                      ok: false,
                      error: "Invalid JSON in request body",
                      code: 400,
              };
              return new Response(JSON.stringify(response), {
                      status: 400,
                      headers: { ...corsHeaders, "Content-Type": "application/json" },
              });
        }

        const validationError = validatePayload(payload);
    if (validationError) {
          const response: ErrorResponse = {
                  ok: false,
                  error: validationError,
                  code: 400,
          };
          return new Response(JSON.stringify(response), {
                  status: 400,
                  headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
    }

        // ============================================================
        // PREPARE DATA FOR INSERT
        // ============================================================
        const registry = payload.registry || "unknown";
    const dedupeKey = generateDedupeKey(registry, payload.tool_name, payload.version);

        // ============================================================
        // DATABASE INSERT
        // Uses ON CONFLICT (dedupe_key) DO NOTHING to handle duplicates
        // 
        // WHY DO NOTHING instead of UPDATE:
        // - We want idempotent ingestion (same payload = same result)
        // - First detection wins (detected_at reflects first occurrence)
        // - No accidental metadata overwrites
        // ============================================================
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

        const { error, count } = await supabase
      .from("stack_pulse_updates")
      .upsert(
        {
                  dedupe_key: dedupeKey,
                  tool_name: payload.tool_name,
                  version: payload.version,
                  registry: registry,
                  detected_at: new Date().toISOString(),
                  metadata: payload.metadata || {},
        },
        {
                  onConflict: "dedupe_key",
                  ignoreDuplicates: true,  // DO NOTHING on conflict
        }
            )
      .select();

        if (error) {
              console.error("Database error:", error);
              const response: ErrorResponse = {
                      ok: false,
                      error: "Database error: " + error.message,
                      code: 500,
              };
              return new Response(JSON.stringify(response), {
                      status: 500,
                      headers: { ...corsHeaders, "Content-Type": "application/json" },
              });
        }

        // If count is 0, the record already existed (duplicate)
        const isDuplicate = (count ?? 0) === 0;

        const response: SuccessResponse = {
              ok: true,
              duplicate: isDuplicate,
              dedupe_key: dedupeKey,
        };

        return new Response(JSON.stringify(response), {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
});
