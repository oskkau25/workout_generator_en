#!/usr/bin/env python3
"""Quality gate enforcement for CI pipelines."""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple


def load_json(path: Path) -> Dict[str, Any]:
    if not path.exists():
        raise FileNotFoundError(f"Required file not found: {path}")
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def get_e2e_status(
    pipeline_results: Dict[str, Any], e2e_results: Dict[str, Any] | None
) -> Tuple[str, str]:
    """Resolve e2e status from dedicated smoke output first, then pipeline tests."""
    if e2e_results:
        status = str(e2e_results.get("status", "UNKNOWN")).upper()
        return status, "reports/test_results/e2e_smoke_result.json"

    tests = pipeline_results.get("tests", {})
    e2e_statuses: List[str] = []

    for name, result in tests.items():
        name_lc = str(name).lower()
        if "e2e" in name_lc or "smoke" in name_lc:
            status = str((result or {}).get("status", "UNKNOWN")).upper()
            e2e_statuses.append(status)

    if not e2e_statuses:
        return "MISSING", "pipeline tests section"
    if "FAILED" in e2e_statuses:
        return "FAILED", "pipeline tests section"
    if "WARNING" in e2e_statuses:
        return "WARNING", "pipeline tests section"
    if "SKIPPED" in e2e_statuses:
        return "SKIPPED", "pipeline tests section"
    if all(status == "PASSED" for status in e2e_statuses):
        return "PASSED", "pipeline tests section"

    return "UNKNOWN", "pipeline tests section"


def evaluate_quality_gate(
    pipeline_results: Dict[str, Any],
    e2e_results: Dict[str, Any] | None,
    min_success_rate: float,
    min_security_score: float,
    min_accessibility_score: float,
) -> Tuple[bool, Dict[str, Any], List[str]]:
    summary = pipeline_results.get("summary", {})
    overall_status = str(pipeline_results.get("overall_status", "UNKNOWN")).upper()
    has_release_ready = "release_ready" in pipeline_results
    release_ready = (
        bool(pipeline_results.get("release_ready")) if has_release_ready else None
    )

    success_rate = float(summary.get("success_rate", 0.0))
    security_score = float(summary.get("security_score", 0.0))
    accessibility_score = float(summary.get("accessibility_score", 0.0))

    e2e_status, e2e_source = get_e2e_status(pipeline_results, e2e_results)

    checks = {
        "overall_status": overall_status,
        "has_release_ready": has_release_ready,
        "release_ready": release_ready,
        "success_rate": success_rate,
        "security_score": security_score,
        "accessibility_score": accessibility_score,
        "e2e_status": e2e_status,
        "e2e_source": e2e_source,
        "thresholds": {
            "min_success_rate": min_success_rate,
            "min_security_score": min_security_score,
            "min_accessibility_score": min_accessibility_score,
        },
    }

    failures: List[str] = []
    if overall_status == "FAILED":
        failures.append("overall_status is FAILED")
    if success_rate < min_success_rate:
        failures.append(
            f"success_rate {success_rate:.1f}% is below {min_success_rate:.1f}%"
        )
    if security_score < min_security_score:
        failures.append(
            f"security_score {security_score:.1f} is below {min_security_score:.1f}"
        )
    if accessibility_score < min_accessibility_score:
        failures.append(
            "accessibility_score "
            f"{accessibility_score:.1f} is below {min_accessibility_score:.1f}"
        )
    if has_release_ready and not release_ready:
        failures.append("release_ready is false")
    if e2e_status in {"FAILED", "MISSING", "UNKNOWN"}:
        failures.append(f"e2e smoke status is {e2e_status}")

    return len(failures) == 0, checks, failures


def write_step_summary(passed: bool, checks: Dict[str, Any], failures: List[str]) -> None:
    summary_path = os.getenv("GITHUB_STEP_SUMMARY")
    if not summary_path:
        return

    lines = [
        "## Quality Gate Result",
        "",
        f"- Status: {'PASSED' if passed else 'FAILED'}",
        f"- Overall pipeline status: {checks['overall_status']}",
        f"- Release ready: {checks['release_ready']}",
        f"- Success rate: {checks['success_rate']:.1f}%",
        f"- Security score: {checks['security_score']:.1f}",
        f"- Accessibility score: {checks['accessibility_score']:.1f}",
        f"- E2E smoke: {checks['e2e_status']} ({checks['e2e_source']})",
        "",
    ]

    if failures:
        lines.append("### Failing Checks")
        lines.extend(f"- {item}" for item in failures)
    else:
        lines.append("All quality checks passed.")

    with Path(summary_path).open("a", encoding="utf-8") as handle:
        handle.write("\n".join(lines) + "\n")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Evaluate quality gate results")
    parser.add_argument(
        "--results",
        default="reports/test_results/automated_test_results.json",
        help="Path to automated pipeline results JSON",
    )
    parser.add_argument(
        "--e2e",
        default="reports/test_results/e2e_smoke_result.json",
        help="Path to dedicated e2e smoke JSON",
    )
    parser.add_argument("--min-success-rate", type=float, default=85.0)
    parser.add_argument("--min-security-score", type=float, default=70.0)
    parser.add_argument("--min-accessibility-score", type=float, default=80.0)
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    results_path = Path(args.results)
    e2e_path = Path(args.e2e)

    try:
        pipeline_results = load_json(results_path)
    except Exception as exc:
        print(f"Quality gate failed: cannot load pipeline results ({exc})")
        return 1

    e2e_results = None
    if e2e_path.exists():
        try:
            e2e_results = load_json(e2e_path)
        except Exception as exc:
            print(f"Warning: cannot parse e2e smoke result ({exc})")

    passed, checks, failures = evaluate_quality_gate(
        pipeline_results=pipeline_results,
        e2e_results=e2e_results,
        min_success_rate=args.min_success_rate,
        min_security_score=args.min_security_score,
        min_accessibility_score=args.min_accessibility_score,
    )

    print("=== QUALITY GATE ===")
    print(f"Status: {'PASSED' if passed else 'FAILED'}")
    print(f"Overall status: {checks['overall_status']}")
    print(f"Release ready: {checks['release_ready']}")
    print(f"Success rate: {checks['success_rate']:.1f}%")
    print(f"Security score: {checks['security_score']:.1f}")
    print(f"Accessibility score: {checks['accessibility_score']:.1f}")
    print(f"E2E smoke: {checks['e2e_status']} ({checks['e2e_source']})")

    if failures:
        print("Failing checks:")
        for failure in failures:
            print(f"- {failure}")

    write_step_summary(passed, checks, failures)
    return 0 if passed else 1


if __name__ == "__main__":
    sys.exit(main())
