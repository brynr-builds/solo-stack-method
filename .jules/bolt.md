## 2026-06-09 - Memoize expensive operations
**Learning:** Found an opportunity to improve performance by memoizing `items.filter` inside `PulseBoard` component using `useMemo`. This prevents re-calculating the filtered items array unnecessarily when typing in the email field or when `submitted` or `watch` state changes.
**Action:** Use `useMemo` for computationally heavy or array filter operations in React components where applicable to prevent redundant re-renders.
