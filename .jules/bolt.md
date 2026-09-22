## 2024-07-30 - Direct File Reads in Content Engines
**Learning:** Parsing an entire directory of markdown files to find a single article via `find()` results in O(N) disk I/O and parsing overhead.
**Action:** When fetching a single item by slug, sanitize the slug and read the specific file directly using `fs.readFileSync` for O(1) performance. Extract the parsing logic into a shared helper function to prevent data structure divergence.
