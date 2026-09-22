## 2024-08-15 - Content Engine O(1) Optimization
**Learning:** The `getArticle` function was doing an O(N) read and parsing of *all* files in the content directory just to find one article by slug.
**Action:** Replaced `readType(type).find(...)` with a direct `fs.readFileSync` based on a sanitized slug, bypassing O(N) disk I/O. Extracted common parsing logic to keep `readType` and `getArticle` DRY. Added memory caching to prevent disk hits entirely in production.
