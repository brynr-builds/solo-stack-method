## 2025-02-24 - File-based content engine performance optimization
**Learning:** In Next.js file-based content engines (like markdown parsing with `fs`), retrieving a single item via `Array.find` after reading and parsing an entire directory causes an O(N) disk I/O and CPU bottleneck.
**Action:** When creating file-based content engines, retrieve single items by directly reading the specific file using a sanitized slug (`fs.readFileSync(path.join(dir, `${path.basename(slug)}.md`))`) to make the operation O(1).
