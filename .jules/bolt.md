## 2024-05-24 - Content Engine Optimization
**Learning:** Next.js content engines using raw filesystem reads can bottleneck on O(N) operations if single-item lookups (e.g. `getArticle`) traverse and parse the entire directory instead of targeting a specific file. When `marked.parse` is involved, this causes heavy CPU usage.
**Action:** Always implement O(1) direct file reading for single item lookups by sanitizing the slug (e.g., `path.basename(slug)`) and extracting the parsing logic into a reusable helper function.
