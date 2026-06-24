## 2024-06-24 - React useMemo optimization
**Learning:** Found an opportunity to optimize `PulseBoard.tsx` by memoizing the `filtered` array, which is computed on every render. Although the array is currently small (~14 items), this prevents unnecessary re-computation and follows React performance best practices.
**Action:** Add `useMemo` to derived state arrays like `filtered` in React components to avoid re-calculating them on every re-render, especially as the list size grows.
