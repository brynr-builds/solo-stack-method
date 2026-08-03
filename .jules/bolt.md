
## 2024-03-22 - Optimizing file-based content engine single reads
**Learning:** For file-based content engines (like Next.js Markdown parsing), retrieving single items using a centralized fetch-all-and-find pattern (`readAll().find()`) creates O(N) disk I/O and CPU bottlenecks (especially with heavy markdown parsers like `marked`).
**Action:** Always retrieve single items by directly reading the specific file using a sanitized slug (e.g., `fs.readFileSync(path.join(dir, \`${path.basename(slug)}.md\`))`). Extract core parsing logic into a shared helper function to prevent data structures from diverging.
