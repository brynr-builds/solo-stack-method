## 2026-06-09 - Avoid O(N) file parsing in getArticle
**Learning:** `getArticle(type, slug)` was previously calling `readType(type)`, which synchronously reads and parses every markdown file in the directory just to find one match. In dynamic routes or during SSG build (`generateMetadata` + page render), this causes O(N^2) file reads and markdown parsing operations across the site.
**Action:** Always read the specific file by slug directly (`${slug}.md`) instead of reading the entire directory and filtering.
