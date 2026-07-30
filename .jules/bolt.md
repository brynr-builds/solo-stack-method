## 2026-06-10 - Content Engine Module-Level Caching
**Learning:** Next.js Server Components and build processes can end up re-parsing static content repeatedly if it's not cached. Reading disk, parsing regexes, and rendering Markdown (via `marked`) synchronously is a significant overhead.
**Action:** Always implement module-level caching using `Map` when parsing static markdown files or heavy objects. Avoid tying it to `react.cache()` so that standalone test scripts and node environments still function correctly.
