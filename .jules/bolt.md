## 2024-05-24 - Initializing Bolt Journal
**Learning:** Start of performance logging.
**Action:** Always check and update this file before making optimizations.
## 2026-06-13 - Optimizing PulseBoard with useMemo/useCallback
**Learning:** Found an interactive component (PulseBoard) passing arrays and functions that could trigger unnecessary calculations and re-renders if the newsletter form state changed.
**Action:** Implemented useMemo for array filtering and useCallback for event handlers to prevent unrelated state changes (like email input typing) from triggering re-calculations of the filtered list.
