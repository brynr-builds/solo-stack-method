## 2026-06-08 - Content Engine Optimization
**Learning:** The content engine currently reads the entire directory and parses all frontmatter every time `getArticle(type, slug)` is called to retrieve a single article. This causes O(N) disk reads and processing for every page load or build step.
**Action:** Since we know the filename `[slug].md`, we can read just that specific file directly instead of reading the whole directory and filtering.
