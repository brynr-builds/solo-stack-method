## 2025-02-24 - Avoid O(N) Disk I/O when reading individual markdown files
**Learning:** For file-based content engines reading Markdown files, retrieving single items by reading and parsing the entire directory causes unnecessary O(N) disk I/O and CPU bottlenecks.
**Action:** Extract the core parsing logic into a shared helper function and retrieve single items by directly reading the specific file using a sanitized slug (e.g., `fs.readFileSync(path.join(dir, \`${path.basename(slug)}.md\`))`).
