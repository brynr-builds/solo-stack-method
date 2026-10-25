## 2026-06-09 - Client vs Server Component Filtering
**Learning:** React components dealing with large sets of static/live affiliate programs or pulse versions must implement basic memoization/caching. Re-renders caused by unrelated text typing (e.g. typing an email in PulseBoard) triggers full array O(n) re-evaluations.
**Action:** Always wrap `filter` with `useMemo` when working with lists inside Client Components that have frequent user input like text fields.

## 2026-06-09 - Server-side Caching for Static Arrays
**Learning:** Functions repeatedly used in renders that process static configuration (like the list of niches and programs in `lib/tools/index.ts`) can simply use global caching since they only change at build/restart time.
**Action:** Precompute/cache results instead of running array `map`, `filter`, and `sort` on every call.
