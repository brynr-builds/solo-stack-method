## 2026-06-09 - Markdown Content Engine Read Optimization
**Learning:** The content engine read single articles by scanning the entire directory and parsing all frontmatter (O(N)), which is a significant bottleneck during single page renders.
**Action:** Always read a specific file directly when resolving single items by slug (using path.basename for safety) instead of reading the parent array to achieve O(1) performance.
