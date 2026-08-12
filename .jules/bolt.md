## 2025-02-25 - Direct File Read for Content Items
**Learning:** Found an O(N) disk I/O and parsing bottleneck where retrieving a single article parsed the entire directory before filtering by slug. This scales poorly as the content directory grows.
**Action:** Always read file-based content directly using a sanitized slug instead of iterating over directories and parsing unrelated files. I will use `path.basename(slug)` for security against path traversal.
