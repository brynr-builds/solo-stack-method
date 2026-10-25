## 2024-08-30 - O(1) content fetching
**Learning:** Next.js content engines that parse Markdown files can suffer from O(N) disk I/O and CPU bottlenecks if they read and parse the entire directory to find a single item.
**Action:** Always retrieve single items by directly reading the specific file using a sanitized slug (e.g., `path.basename(slug)`) and extract parsing logic into a shared helper function.
