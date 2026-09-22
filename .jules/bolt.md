## 2025-02-27 - Direct File Reads for Content Engines
**Learning:** For file-based content engines (like Next.js Markdown parsing), retrieving single items by directly reading the specific file using a sanitized slug is significantly faster than reading and parsing the entire directory to find a match, avoiding O(N) disk I/O and CPU bottlenecks.
**Action:** Extract core parsing logic into a shared helper function (e.g., `parseArticle`) to maintain DRY principles, and update singular retrieval functions (e.g., `getArticle`) to directly access the target file using `fs.readFileSync`.
