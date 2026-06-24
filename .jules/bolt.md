## 2024-05-14 - React optimizations
**Learning:** Found multiple opportunities to use `React.memo` or React 18+ hooks for optimizing React functional components to prevent unnecessary re-renders in larger files, like `PlanIntake.tsx` which manages significant state.
**Action:** Use `React.memo` for static sub-components like `Q` in `PlanIntake.tsx` and check `PulseBoard.tsx`.
## 2024-05-14 - React.memo lint issue
**Learning:** `React.memo` with inline arrow functions or anonymous functions may cause formatting/linting issues with parenthesis when used with the particular eslint config.
**Action:** When adding React.memo, use `const Component = React.memo(function Component(...) { ... })` and ensure the closing `});` does not break linter rules. Nextjs `eslint` does not complain about `});` but some combinations fail `next lint` if there's a parsing error.

## 2024-05-14 - React.memo with children
**Learning:** Adding `React.memo` to a component that takes `children` prop containing JSX elements is a false optimization because `children` will be a new element object on each render, causing shallow equality to fail and rendering to proceed anyway.
**Action:** Do not use `React.memo` on wrapper components that receive dynamic `children` props unless those children are also memoized, or you provide a custom comparison function that ignores children (if applicable).
