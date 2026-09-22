## 2024-08-18 - Markdown Parsing O(N) Optimization
**Learning:** `getArticle` was reading ALL files in the directory and parsing them to find a single matching slug (O(N) operation where N is the number of files). This becomes slow as the content folder grows.
**Action:** Extract parsing logic to a shared helper and change `getArticle` to directly read the specific file by slug (O(1) operation), using path sanitization.
