# Step 4: Build Features

## Goal
Implement features through governed AI-assisted development with proper separation of duties.

## Constraints
- Builder agent (Claude) writes code
- All changes go through branch → PR pattern
- Compatibility must be confirmed before modifying files
- DEV NOTES required for every new/modified file
- No direct commits to main

## Success Definition
- Features are implemented and functional
- Code includes DEV NOTES explaining intent
- Changes are in logical commits
- PR is ready for audit
- No breaking changes to existing functionality

## What Must NOT Happen
- Do not skip compatibility checks
- Do not commit without DEV NOTES
- Do not merge without audit
- Do not break existing routes/imports
- Do not overbuild beyond current scope

## Compatibility
- Must preserve routes established in prior steps
- Must not break imports or layouts
- Must confirm deployment still works
