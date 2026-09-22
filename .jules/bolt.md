## 2026-07-21 - O(N) Disk I/O Bottleneck in Static File Reading
**Learning:** When a custom content engine reads a single markdown file by scanning the entire directory and parsing frontmatter for every file just to find a matching slug, it introduces a massive O(N) disk I/O and parsing overhead for single item retrievals.
**Action:** Always read the specific file directly using the sanitized slug (e.g., `fs.readFileSync(path.join(dir, `${path.basename(slug)}.md`))`) instead of reading and filtering the entire directory.
