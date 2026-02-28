# Testing Artifacts Policy

This repository keeps test code and pipeline definitions in git, but does not keep generated test outputs in git history.

## Keep in Git

- Test scripts and pipeline code (for example `ci-cd/*.py` and workflow files)
- Stable documentation under `docs/`
- Placeholder files such as `reports/test_results/.gitkeep` for directory structure

## Do Not Keep in Git

- Screenshot outputs from automated runs (any `*screenshots*` directory)
- Generated JSON test results (for example `*_results.json` and `reports/test_results/*.json`)
- Runtime logs (`*.log`) and cache artifacts (`*.pkl`, `.cache`, `__pycache__`)

## Where Runtime Outputs Go

Runtime artifacts are uploaded by GitHub Actions using `actions/upload-artifact` so they are available per run without bloating repository history.

If you run tests locally, generated artifacts remain local and should stay untracked.
