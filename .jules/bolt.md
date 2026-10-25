
## 2025-02-24 - File-Based Content Engine O(N) I/O Bottleneck
**Learning:** The content engine was reading the entire content directory and parsing every markdown file (including rendering HTML with `marked`) just to find one article by slug in `getArticle`. This caused O(N) disk I/O and CPU overhead on every single article request, which scales poorly as the content library grows.
**Action:** When retrieving single items from file-based content systems, construct the specific file path using the slug directly (`path.basename(slug)` for security) to achieve O(1) reads. Use module-level caching (with a dev mode bypass) to eliminate repeated disk I/O and parsing overhead. Extract core parsing logic into a shared helper to maintain DRY principles between `readAll` and `readSingle` patterns.
