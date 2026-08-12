## 2026-07-24 - [Optimize getArticle performance by reading file directly]
**Learning:** Bypassing an O(N) array filter/map operation by directly reading a target file offers huge performance wins for content engines, but requires extracting a shared parsing helper to prevent DRY violations and ensuring dynamic paths are sanitized against directory traversal.
**Action:** When implementing O(1) file reads for content slugs, extract a shared `parseFile(path)` helper used by both bulk and single-fetch functions, and always sanitize the slug input.
