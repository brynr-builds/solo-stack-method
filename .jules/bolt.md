## Bolt Journal
## 2024-08-01 - Content Engine O(N) Read Bottleneck
**Learning:** For file-based content engines, retrieving a single article by reading and parsing the entire directory to find a match creates an O(N) disk I/O and CPU bottleneck.
**Action:** Extract parsing logic into a shared helper function and read the specific file directly using a sanitized slug (e.g., `fs.readFileSync(path.join(dir, \`${path.basename(slug)}.md\`))`).
