## 2024-05-24 - O(N) Disk I/O in Content Engine
**Learning:** The custom markdown content engine originally used a `readType().find()` pattern for single item lookup. This caused an O(N) disk read and parse bottleneck because Next.js page generation processes the entire directory of articles for every individual article page request.
**Action:** Always fetch single file-based items via direct `fs.readFileSync` with `path.basename(slug)` rather than filtering a read of the entire directory. Extract parsing logic to a shared helper to keep DRY.
