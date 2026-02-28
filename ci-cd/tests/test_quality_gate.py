import unittest
from pathlib import Path
import sys


CI_CD_DIR = Path(__file__).resolve().parents[1]
if str(CI_CD_DIR) not in sys.path:
    sys.path.insert(0, str(CI_CD_DIR))

from quality_gate import evaluate_quality_gate  # noqa: E402


class QualityGateTests(unittest.TestCase):
    def test_quality_gate_passes_with_valid_inputs(self):
        pipeline_results = {
            "overall_status": "PASSED",
            "release_ready": True,
            "summary": {
                "success_rate": 92.5,
                "security_score": 85,
                "accessibility_score": 88,
            },
            "tests": {},
        }
        e2e_results = {"status": "PASSED"}

        passed, checks, failures = evaluate_quality_gate(
            pipeline_results,
            e2e_results,
            min_success_rate=85,
            min_security_score=70,
            min_accessibility_score=80,
        )

        self.assertTrue(passed)
        self.assertEqual(checks["e2e_status"], "PASSED")
        self.assertEqual(failures, [])

    def test_quality_gate_fails_on_thresholds_and_e2e(self):
        pipeline_results = {
            "overall_status": "WARNING",
            "release_ready": False,
            "summary": {
                "success_rate": 70.0,
                "security_score": 65.0,
                "accessibility_score": 75.0,
            },
            "tests": {},
        }
        e2e_results = {"status": "FAILED"}

        passed, checks, failures = evaluate_quality_gate(
            pipeline_results,
            e2e_results,
            min_success_rate=85,
            min_security_score=70,
            min_accessibility_score=80,
        )

        self.assertFalse(passed)
        self.assertEqual(checks["e2e_status"], "FAILED")
        self.assertGreaterEqual(len(failures), 4)


if __name__ == "__main__":
    unittest.main()
