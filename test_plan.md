1. We will refactor `web/app/audit-score/page.tsx` by extracting logical UI blocks into separate component files within `web/app/audit-score/components/`.
2. The main components to extract are:
   - `ModeCards.tsx` (the "Mode Explanation Cards" section)
   - `RunAuditSection.tsx` (the "Run Audit Section" input and button)
   - `AuditResults.tsx` (the entire "Results Section" when `hasResults` is true)
   - `EmptyState.tsx` (the "Empty State" when `hasResults` is false)
   - `RubricDocumentation.tsx` (the "Rubric Documentation" section)
   - `SubscriptionModal.tsx` (the subscription modal at the bottom)
3. After creating the components, we will replace the inline JSX in `web/app/audit-score/page.tsx` with these imported components. This will significantly reduce the size of the main `AuditScorePage` component, improving readability.
4. We'll run the linter (`npm run lint` inside `web`) and test suite (`npm run test` inside `web`) to verify that the refactoring didn't introduce errors.
5. Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
6. Submit a PR titled "🧹 [Refactor AuditScorePage for better readability]".
