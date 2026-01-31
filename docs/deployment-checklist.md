# Deployment Checklist

This checklist covers the deployment steps for Stack Pulse components.

## Stack Pulse Edge Function

### Prerequisites

- Supabase project created
- - Supabase CLI installed (`npm install -g supabase`)
  - - Database schema deployed (see `SUPABASE_MIGRATION.sql`)
   
    - ### 1. Deploy the Edge Function
   
    - The function code is located at:
    - ```
      supabase/functions/stack-pulse/index.ts
      ```

      Deploy using Supabase CLI:
      ```bash
      # Login to Supabase (if not already)
      supabase login

      # Link to your project
      supabase link --project-ref YOUR_PROJECT_REF

      # Deploy the function
      supabase functions deploy stack-pulse
      ```

      ### 2. Set the STACK_PULSE_SECRET

      Generate a secure random secret:
      ```bash
      openssl rand -base64 32
      ```

      Set it as an environment variable for the function:
      ```bash
      supabase secrets set STACK_PULSE_SECRET=your-generated-secret
      ```

      **Important:** Store this secret securely. You'll need it for any service that pushes updates to Stack Pulse.

      ### 3. Test Locally with curl

      Before deploying, you can test locally:

      ```bash
      # Start local Supabase
      supabase start

      # Set local secret
      export STACK_PULSE_SECRET=test-secret-for-local

      # Test the endpoint
      curl -X POST \
        'http://localhost:54321/functions/v1/stack-pulse' \
        -H 'Authorization: Bearer test-secret-for-local' \
        -H 'Content-Type: application/json' \
        -d '{
          "tool_name": "test-package",
          "version": "1.0.0",
          "registry": "npm"
        }'
      ```

      Expected response:
      ```json
      {
        "ok": true,
        "duplicate": false,
        "dedupe_key": "npm:test-package:1.0.0"
      }
      ```

      ### 4. Test Production Endpoint

      After deployment:
      ```bash
      curl -X POST \
        'https://YOUR_PROJECT.supabase.co/functions/v1/stack-pulse' \
        -H 'Authorization: Bearer YOUR_STACK_PULSE_SECRET' \
        -H 'Content-Type: application/json' \
        -d '{
          "tool_name": "lodash",
          "version": "4.17.21",
          "registry": "npm"
        }'
      ```

      ### Verification Checklist

      - [ ] Function deployed successfully
      - [ ] - [ ] STACK_PULSE_SECRET configured
      - [ ] - [ ] Local curl test returns `{"ok": true, ...}`
      - [ ] - [ ] Production curl test returns `{"ok": true, ...}`
      - [ ] - [ ] Duplicate detection works (same payload returns `"duplicate": true`)
      - [ ] - [ ] Auth rejection works (wrong/missing token returns 401)
     
      - [ ] ---
     
      - [ ] *See also:* [Stack Pulse Documentation](./stack-pulse.md) | [Schema Reference](./schema.md)
