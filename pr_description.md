🎯 **What:** Refactored the `PulsePage` component in `web/app/pulse/page.tsx`. Extracted the static mock data to `data.ts` and the UI sections into separate, smaller components (`FilterTabs.tsx`, `PulseGrid.tsx`, and `NewsletterSignup.tsx`).

💡 **Why:** The `PulsePage` component was overly long, acting as a monolithic function containing significant data, multiple distinct UI sections, and complex state management. Breaking this down into smaller, focused components drastically improves maintainability and readability.

✅ **Verification:**
- Used shell commands to visually verify the extracted components and simplified `page.tsx`.
- Ran Next.js linting (`npm run lint`), fixing `react/no-unescaped-entities` errors introduced in the refactored code.
- Successfully executed the Vitest test suite (`npm run test`) to ensure no functional regressions.

✨ **Result:** The `PulsePage` is now a lean layout and state orchestrator, making the codebase cleaner, easier to test, and simpler to modify in future phases.
