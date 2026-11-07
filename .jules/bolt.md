## 2025-02-19 - Bypassing O(N) Reads in File-Based Content Engines
**Learning:** In file-based content systems (e.g., Next.js reading markdown files), retrieving a single item by mapping over the entire directory and calling `.find()` introduces an O(N) disk I/O and CPU bottleneck.
**Action:** Always fetch single file items directly using sanitized file paths `fs.readFileSync(path.join(dir, \`${path.basename(slug)}.md\`))` to achieve O(1) performance. Extract parsing logic to a shared helper to keep data models DRY.
