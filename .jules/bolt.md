## 2024-05-18 - [Optimizing Next.js Markdown Parsing]
**Learning:** In Next.js file-based content engines, retrieving a single article by reading the entire directory and parsing all markdown files before finding the match creates an O(N) disk I/O and CPU bottleneck.
**Action:** Always fetch single items by directly reading the specific file using a sanitized slug (e.g., `fs.readFileSync(path.join(dir, `${path.basename(slug)}.md`))`) to achieve O(1) retrieval time.
