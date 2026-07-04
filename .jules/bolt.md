## 2024-05-18 - Caching static file reads
**Learning:** React's `cache()` is not available during standard execution contexts like vitest or custom build tools (unless explicitly configured to use Next.js). Module-level caching with maps works perfectly for markdown file reading without breaking Node environments.

**Action:** When caching file system reads for static routes or content, prefer simple Map/memoization at the module level rather than tying execution to Next.js specific cache layers, allowing unit tests to run cleanly in Node.js.
