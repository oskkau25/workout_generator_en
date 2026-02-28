# TEST_AUDIT

High-signal test rationalization for release confidence.

## Canonical Release Contract

Blocking release decision sequence (run in order):

1. `unit`  
   `python -m unittest discover -s ci-cd/tests -p "test_*.py" -v`
2. `e2e smoke`  
   `python ci-cd/run_e2e_smoke.py`
3. `regression sweep`  
   `python ci-cd/regression_sweep.py`
4. `quality gate`  
   `python ci-cd/quality_gate.py --results reports/test_results/automated_test_results.json --e2e reports/test_results/e2e_smoke_result.json --min-success-rate 85 --min-security-score 70 --min-accessibility-score 80 --strict-e2e --fail-on-overall-warning`

This is the only blocking release contract.

## KEEP

- `ci-cd/tests/test_quality_gate.py` - fast, deterministic gate unit coverage.
- `ci-cd/tests/test_e2e_runner.py` - fast helper-level e2e runner checks.
- `ci-cd/run_e2e_smoke.py` - dedicated smoke command and artifact writer.
- `ci-cd/e2e_runner.py` - deterministic critical-path smoke implementation.
- `ci-cd/regression_sweep.py` - focused functional regression matrix.
- `ci-cd/quality_gate.py` - final pass/fail policy authority.
- `.github/workflows/ci-cd.yml` - runs the canonical blocking path in CI.
- `ci-cd/automated_test_pipeline.py` - supporting broad signal/reporting, but not the sole release authority.

## REWRITE

- Dynamic feature-detection checks inside `ci-cd/automated_test_pipeline.py` - keep as advisory signal, but reduce brittle presence-based heuristics over time.

## MANUAL (non-blocking)

- `ci-cd/run_complete_test_suite.py`
- `ci-cd/final_selenium_test.py`
- `ci-cd/comprehensive_selenium_tests.py`
- `ci-cd/advanced_selenium_tests.py`
- `ci-cd/user_interaction_tests.py`
- `ci-cd/responsive_design_tests.py`
- `ci-cd/performance_monitoring_tests.py`
- `ci-cd/security_validation_tests.py`
- `ci-cd/accessibility_compliance_tests.py`
- `.github/workflows/automated-testing.yml` (manual dispatch only)

These suites are useful for deep diagnostics and exploratory coverage, but are flaky/slow enough to avoid blocking CI release gates.

## REMOVE

- `ci-cd/enhanced_automated_pipeline.py` (candidate) - overlapping legacy pipeline path; remove after confirming no active consumers.

