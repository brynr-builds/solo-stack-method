## 2026-06-08 - Optimized O(N) single item lookup
**Learning:** For file-based content engines reading Markdown files, `getArticle` was doing an O(N) directory parse + rendering of all files just to find a single item.
**Action:** Extract parsing logic into a shared helper function `parseFile`. For single item lookups, sanitize the slug (using `path.basename(slug)`) to prevent path traversal, and directly read the single target file. Added a `Map` based module-level memory cache (skipped in development to not break HMR).
