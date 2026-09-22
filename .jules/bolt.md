## 2024-08-31 - Optimize Next.js file-based content engine

**Learning:** When retrieving single items from a file-based content engine (like reading Markdown files based on slugs in Next.js), the previous implementation read and parsed the entire directory of files to find a match, which causes O(N) disk I/O and CPU bottlenecks.

**Action:** Extracted the core parsing logic into a shared helper function `parseArticle` and updated `getArticle` to use a direct file read based on a sanitized slug. This transforms the operation from O(N) to O(1) and prevents path traversal security vulnerabilities.
