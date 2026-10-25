
## 2026-06-08 - O(N) to O(1) file reads for content articles
**Learning:** Using `readdirSync` and mapping over all files just to find a single file by slug creates a massive CPU and I/O bottleneck in file-based content engines as content scales.
**Action:** When retrieving a single markdown file by slug, use direct file reads (e.g. `readFileSync(path.join(dir, `${path.basename(slug)}.md`))`) and avoid loading the entire directory.
