#!/usr/bin/env python3
"""Run and persist a dedicated E2E smoke check for CI."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from e2e_runner import run_dynamic_smoke


def main() -> int:
    results = run_dynamic_smoke()
    status = str(results.get("status", "UNKNOWN")).upper()

    output_dir = Path("reports/test_results")
    output_dir.mkdir(parents=True, exist_ok=True)
    output_file = output_dir / "e2e_smoke_result.json"

    with output_file.open("w", encoding="utf-8") as handle:
        json.dump(results, handle, indent=2)

    print(f"E2E smoke status: {status}")
    print(f"Saved: {output_file}")

    return 1 if status == "FAILED" else 0


if __name__ == "__main__":
    sys.exit(main())
