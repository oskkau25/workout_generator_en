import unittest
from pathlib import Path
import sys


CI_CD_DIR = Path(__file__).resolve().parents[1]
if str(CI_CD_DIR) not in sys.path:
    sys.path.insert(0, str(CI_CD_DIR))

from e2e_runner import _is_port_open, _retry_test  # noqa: E402


class E2ERunnerHelperTests(unittest.TestCase):
    def test_is_port_open_false_for_unused_port(self):
        self.assertFalse(_is_port_open("127.0.0.1", 65500))

    def test_retry_test_retries_then_succeeds(self):
        state = {"calls": 0}

        def flaky():
            state["calls"] += 1
            if state["calls"] < 3:
                raise RuntimeError("temporary failure")
            return "ok"

        result = _retry_test(flaky, max_retries=3, delay=0.01)
        self.assertEqual(result, "ok")
        self.assertEqual(state["calls"], 3)

    def test_retry_test_raises_after_exhausting_retries(self):
        def always_fail():
            raise ValueError("fail")

        with self.assertRaises(ValueError):
            _retry_test(always_fail, max_retries=2, delay=0.01)


if __name__ == "__main__":
    unittest.main()
