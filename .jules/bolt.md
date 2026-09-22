## 2024-05-24 - [Optimize File Content Read O(N) to O(1)]
**Learning:** `getArticle` performs an O(N) read/parse operation reading all files before `find`ing the one it needs, wasting disk IO and CPU.
**Action:** Extract the markdown parser and directly read the requested file with `fs.readFileSync(path.join(CONTENT_ROOT, type, ${path.basename(slug)}.md))`
