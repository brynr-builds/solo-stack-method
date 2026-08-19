## 2026-06-08 - O(N) Content Engine Bottleneck

**Learning:** The hand-rolled content engine (`web/lib/content.ts`) used `readType(type).find(a => a.slug === slug)` to fetch single articles. Because `readType` eagerly reads and parses EVERY markdown file in the directory using `fs.readFileSync` and `marked`, fetching a single article scaled terribly (O(N) file I/O and parsing) as content grew.

**Action:** When querying file-based content engines for single items, always retrieve the specific file directly using its slug (e.g., `fs.readFileSync(path.join(dir, `${path.basename(slug)}.md`))`) to make it an O(1) operation. Ensure to sanitize the input using `path.basename` to prevent Path Traversal vulnerabilities.
