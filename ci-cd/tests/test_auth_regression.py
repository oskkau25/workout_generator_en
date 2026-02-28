import sys
import unittest
from pathlib import Path

from playwright.sync_api import sync_playwright


CI_CD_DIR = Path(__file__).resolve().parents[1]
if str(CI_CD_DIR) not in sys.path:
    sys.path.insert(0, str(CI_CD_DIR))

from regression_sweep import LocalServer  # noqa: E402


class AuthRegressionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = LocalServer(start_port=8010)
        cls.base_url = cls.server.start()
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(headless=True)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        cls.server.stop()

    def setUp(self):
        self.context = self.browser.new_context()
        self.page = self.context.new_page()
        self.page.goto(self.base_url, wait_until="networkidle")
        self.page.wait_for_function("() => !!window.userAccount", timeout=15000)
        self.page.evaluate(
            """() => {
                localStorage.removeItem('fitflow_current_user');
                localStorage.removeItem('fitflow_users');
                window.userAccount.logout();
            }"""
        )

    def tearDown(self):
        self.context.close()

    def test_register_login_reset_and_login_with_new_password(self):
        username = "auth_regression_flow_user"
        password = "Pass1234!"
        new_password = "NewPass5678!"

        register_result = self.page.evaluate(
            """async ({ username, password }) => {
                return await window.userAccount.register(username, password, {
                    name: 'Auth Regression User',
                    securityQuestion: 'pet_name',
                    securityAnswer: 'fluffy',
                    experience: 'Beginner'
                });
            }""",
            {"username": username, "password": password},
        )
        self.assertTrue(register_result.get("success"), register_result)

        self.page.evaluate("() => window.userAccount.logout()")
        login_original = self.page.evaluate(
            """async ({ username, password }) => {
                return await window.userAccount.login(username, password);
            }""",
            {"username": username, "password": password},
        )
        self.assertTrue(login_original.get("success"), login_original)

        reset_result = self.page.evaluate(
            """async ({ username, newPassword }) => {
                return await window.userAccount.resetPassword(
                    username,
                    'pet_name',
                    ' FlUfFy ',
                    newPassword
                );
            }""",
            {"username": username, "newPassword": new_password},
        )
        self.assertTrue(reset_result.get("success"), reset_result)

        self.page.evaluate("() => window.userAccount.logout()")
        login_new = self.page.evaluate(
            """async ({ username, password }) => {
                return await window.userAccount.login(username, password);
            }""",
            {"username": username, "password": new_password},
        )
        self.assertTrue(login_new.get("success"), login_new)

        self.page.evaluate("() => window.userAccount.logout()")
        login_old_after_reset = self.page.evaluate(
            """async ({ username, password }) => {
                return await window.userAccount.login(username, password);
            }""",
            {"username": username, "password": password},
        )
        self.assertFalse(login_old_after_reset.get("success"), login_old_after_reset)

    def test_register_stores_hashed_security_answer(self):
        username = "auth_regression_storage_user"
        password = "Pass1234!"

        register_result = self.page.evaluate(
            """async ({ username, password }) => {
                return await window.userAccount.register(username, password, {
                    name: 'Auth Regression User',
                    securityQuestion: 'pet_name',
                    securityAnswer: 'fluffy'
                });
            }""",
            {"username": username, "password": password},
        )
        self.assertTrue(register_result.get("success"), register_result)

        security_answer_metadata = self.page.evaluate(
            """() => {
                const users = JSON.parse(localStorage.getItem('fitflow_users') || '[]');
                const user = users.find((u) => u.username === 'auth_regression_storage_user');
                const stored = user?.profile?.securityAnswer || '';
                if (!stored || stored === 'fluffy') {
                    return { stored, isHashed: false };
                }

                try {
                    const parsed = JSON.parse(stored);
                    const isHashed = Array.isArray(parsed.hash) && Array.isArray(parsed.salt) && typeof parsed.iterations === 'number';
                    return { stored, isHashed };
                } catch (_error) {
                    return { stored, isHashed: false };
                }
            }"""
        )

        self.assertTrue(security_answer_metadata.get("isHashed"), security_answer_metadata)


if __name__ == "__main__":
    unittest.main()
