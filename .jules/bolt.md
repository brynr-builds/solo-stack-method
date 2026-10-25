## 2025-02-25 - Direct File Read for Single Items in Next.js

**Learning:** Content engines that parse Markdown files (like in `web/lib/content.ts`) can create O(N) disk I/O and CPU bottlenecks if they read the entire directory to find a single item (`readAll().find()`).

**Action:** When retrieving a single file by slug, always use direct O(1) file reads (e.g. `fs.readFileSync(path.join(dir, ${path.basename(slug)}.md))`) combined with path traversal sanitization (`path.basename(slug)`) rather than parsing the entire directory.
