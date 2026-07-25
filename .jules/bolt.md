## 2025-07-25 - [Optimize File Content Retrieval]
**Learning:** In Next.js content engines using `fs`, replacing a directory read and map loop (O(N) operations) with a direct file read when seeking a specific single item by slug drastically improves read performance.
**Action:** When a function fetches a single item by an identifier (e.g., `slug`), avoid `readAll().find()` and implement direct access using path matching. Always remember to sanitize the identifier to prevent path traversal when adopting direct file system reads.
