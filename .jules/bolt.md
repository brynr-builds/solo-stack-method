## 2023-10-27 - Content Engine File I/O Optimization
**Learning:** For file-based content engines (like Next.js Markdown parsing in `web/lib/content.ts`), retrieving a single item by reading the entire directory and parsing all files to find a match creates an O(N) disk I/O and CPU bottleneck.
**Action:** Always retrieve single items by directly reading the specific file using a sanitized slug (e.g., `fs.readFileSync(path.join(dir, \`\${path.basename(slug)}.md\`))`).
