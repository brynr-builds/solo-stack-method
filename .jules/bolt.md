## 2025-02-25 - Avoid O(N) file reads for single content items
**Learning:** In a file-based content engine (like Next.js Markdown parsing in this project), using `readAll().find()` to retrieve a single item by slug forces the system to read and parse the entire directory of files. This causes O(N) disk I/O and CPU bottlenecks on every single-page build or request.
**Action:** Always read the single target file directly using a sanitized slug (`fs.readFileSync(path.join(dir, `${path.basename(slug)}.md`))`) and isolate the parsing logic to a shared helper to maintain DRY principles.
