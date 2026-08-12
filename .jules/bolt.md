## 2024-05-18 - Avoid O(N) operations in Content Engine
**Learning:** `getArticle` was reading and parsing the entire directory of Markdown files (using `readType`) just to find one matching file by slug, which causes unnecessary disk I/O and CPU parsing overhead.
**Action:** Replaced it with a direct read of the specific file based on the slug using `fs.readFileSync(path.join(CONTENT_ROOT, type, `${safeSlug}.md`))`.
