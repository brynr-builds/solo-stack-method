## 2024-08-17 - Direct File Reads for Content Engine
**Learning:** The content engine (`lib/content.ts`) used `readAll().find()` to fetch single articles, which reads and parses all markdown files in the directory. This is an O(N) disk I/O and CPU bottleneck.
**Action:** When a slug is known, directly read the specific markdown file `fs.readFileSync(path.join(dir, \`\${slug}.md\`))` instead of scanning the whole directory. Use `path.basename` to prevent path traversal, and extract parsing logic into a shared helper to maintain DRY.
