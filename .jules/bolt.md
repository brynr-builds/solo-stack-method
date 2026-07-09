## 2026-10-27 - [Markdown Parsing Bottleneck]
**Learning:** For file-based content engines, retrieving single items by directly reading the specific file using a sanitized slug is significantly faster than reading and parsing the entire directory to find a match, which avoids O(N) disk I/O and CPU bottlenecks.
**Action:** Always rewrite `getArticle` functions to use `fs.readFileSync` with the specific slug path rather than falling back to filtering the array returned by `readType()`.
