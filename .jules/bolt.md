## 2025-02-25 - Content Engine `getArticle` O(N) Bottleneck
**Learning:** `getArticle` was reading and parsing markdown (using `marked`) for ALL articles in a directory just to return one. This was causing O(N) disk I/O and CPU overhead per page view or metadata generation.
**Action:** Always fetch the specific file directly using its slug (and sanitize the slug with `path.basename` to avoid directory traversal) rather than filtering an array of all parsed files.
