import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// Minimal config for the preview: default (in-memory) incremental cache so we don't need an R2
// bucket yet. Swap in r2IncrementalCache before production if ISR caching matters.
export default defineCloudflareConfig({});
