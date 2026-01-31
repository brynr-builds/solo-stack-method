# Step 7: Deploy

## Goal
Ship the audited, approved changes to production.

## Constraints
- Only deploy after audit approval
- Merge PR to main (main = production)
- Deployment should be automated via platform (Netlify/Vercel)
- Monitor for deployment errors
- Have rollback plan ready

## Success Definition
- PR is merged to main
- Deployment completes successfully
- Production site is accessible
- No deployment errors
- Changes are live and functional

## What Must NOT Happen
- Do not deploy without audit approval
- Do not deploy broken code
- Do not skip deployment verification
- Do not lose ability to rollback
- Do not ignore deployment errors

## Compatibility
- Deployment must work with netlify.toml/vercel.json
- Must not break existing production functionality
- Must preserve all routes and features
