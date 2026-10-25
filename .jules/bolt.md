## Bolt's Journal
## 2025-02-28 - Isolate React controlled input state
**Learning:** In large React components rendering maps/grids, maintaining high-frequency state updates like controlled text inputs (e.g., an email address field) in the top-level parent causes the entire list/grid to re-render on every keystroke.
**Action:** Always isolate controlled text inputs and forms into their own leaf components to prevent large parent components from re-rendering unnecessarily.
