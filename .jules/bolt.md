## 2025-02-12 - File-based O(N) optimizations
**Learning:** Found an $O(N)$ lookup in a file-based content engine (`web/lib/content.ts`). `getArticle` was reading the entire directory, reading every file, parsing their YAML, and converting markdown to HTML via `marked`, just to return one item by a known slug.
**Action:** When working with file-based content, always look for opportunities to compute the exact file path from the requested slug (with proper sanitization via `path.basename`) to enable $O(1)$ direct file reads, bypassing expensive N+1 operations on disk.
