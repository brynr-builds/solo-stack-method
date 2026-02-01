# Step 1: Create Repo + Connect GitHub

## Goal
Initialize a governed repository that serves as the single source of truth for the entire project.

## Constraints
- Repository MUST be created before any code is written
- Never commit secrets (API keys, passwords, tokens)
- Main branch is production — never commit directly
- All work happens on feature branches
- Repo-as-Truth™: context, prompts, and governance live in-repo

## Success Definition
- GitHub repository exists and is accessible
- Main branch is protected (no direct commits)
- README exists with project intent
- .gitignore configured appropriately
- User can create branches and push commits

## What Must NOT Happen
- Do not skip repository creation
- Do not use local-only development
- Do not store secrets in repo
- Do not allow unreviewed commits to main
- Do not overbuild: no CI/CD pipelines, no complex automation yet

## Compatibility
- This step establishes the foundation all other steps depend on
- GitHub connection is required for Steps 2-7
- Context established here flows through entire workflow
