## 2024-05-14 - Initial\n**Learning:** Started Bolt journal.\n**Action:** Keep learning.

## 2024-05-14 - Optimize File Reading Operations
**Learning:** Found an O(N) performance bottleneck where the content engine (`getArticle`) would scan an entire directory of Markdown files, parse frontmatter, and convert all of them to HTML just to find a single match by slug.
**Action:** When fetching single records from a file system, always read the specific file directly using the sanitized identifier (e.g. `path.basename(slug)`) instead of loading the entire collection.
