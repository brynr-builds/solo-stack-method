## 2026-07-19 - Optimize getArticle in content engine
**Learning:** In Next.js content engines that parse local markdown, fetching a single article by reading the entire directory and parsing every single file (O(N) operation) creates a significant CPU and I/O bottleneck, especially as the content library grows.
**Action:** Always fetch single items by directly reading the specific file using a sanitized slug (`path.basename(slug)`) rather than using `find` or iterating over the entire directory. This turns an O(N) operation into an O(1) operation.
