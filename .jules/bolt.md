## 2026-06-08 - Caching server-side Markdown file reading
**Learning:** The content engine (`lib/content.ts`) was reading, parsing frontmatter, and compiling Markdown from disk on every `getArticles` or `getArticle` call. During Next.js static site generation or SSR, these functions are called repeatedly for the same data, causing unnecessary I/O and CPU overhead.
**Action:** Always wrap server-side file reading or expensive parsing functions with React's `cache()` to memoize the results per-request. This reduces redundant work significantly (e.g. 5.5ms -> 0.05ms).
