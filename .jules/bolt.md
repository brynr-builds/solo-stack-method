## 2024-05-28 - Content Engine O(N) Bottleneck Fixed
**Learning:** The content engine read and parsed ALL markdown files across the directory for every single article fetch via `.find()`, causing a massive O(N) disk I/O and CPU (`marked` parsing) bottleneck when routing to individual pages.
**Action:** Always bypass centralized reading functions for single-item fetches by directly reading specific files with a sanitized slug (`path.basename`). Implement module-level map caching with a development bypass (`NODE_ENV !== 'development'`) to avoid breaking hot-reloading.
