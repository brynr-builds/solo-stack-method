## 2026-06-08 - [O(1) Content Reading]
**Learning:** The content engine (`web/lib/content.ts`) was reading and parsing every single markdown file in a directory to find a single match (O(N) operations and disk I/O).
**Action:** When fetching single file-based resources based on a slug, always use `fs.readFileSync` directly with the sanitized slug (using `path.basename`) to achieve O(1) performance instead of parsing the full directory.
