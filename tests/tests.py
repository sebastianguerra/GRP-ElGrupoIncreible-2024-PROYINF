# pylint: disable=missing-module-docstring, missing-class-docstring, missing-function-docstring
import unittest
import requests

BASE_URL = "http://localhost:3001"
LOGIN_PATH = "/login"
REGISTER_PATH = "/register"
ME_PATH = "/me"


class TestLogin(unittest.TestCase):
    USER = {
        "username": "TestLoginUser",
        "password": "TestLoginPassword",
    }

    def setUp(self) -> None:
        res = requests.post(f"{BASE_URL}{REGISTER_PATH}",
                            json=self.USER, timeout=10)
        self.assertEqual(res.status_code, 201)

        data = res.json()

        self.token = data["token"]

    def tearDown(self) -> None:
        headers = {
            "Authorization": f"Bearer {self.token}"
        }
        res = requests.delete(f"{BASE_URL}{ME_PATH}",
                              headers=headers, timeout=10)
        self.assertEqual(res.status_code, 204)

    def test_login(self):
        res = requests.post(f"{BASE_URL}{LOGIN_PATH}",
                            json=self.USER, timeout=10)
        self.assertEqual(res.status_code, 200)

        data = res.json()

        self.assertIn("token", data)

    def test_login_wrong_password(self):
        res = requests.post(f"{BASE_URL}{LOGIN_PATH}", json={
            "username": self.USER["username"],
            "password": "invalid"
        }, timeout=10)

        self.assertEqual(res.status_code, 401)

    def test_login_wrong_username(self):
        res = requests.post(f"{BASE_URL}{LOGIN_PATH}", json={
            "username": "invalid",
            "password": self.USER["password"]
        }, timeout=10)

        self.assertEqual(res.status_code, 401)

    def test_login_empty_data(self):
        res = requests.post(f"{BASE_URL}{LOGIN_PATH}", json={}, timeout=10)

        self.assertEqual(res.status_code, 400)


class TestRegister(unittest.TestCase):
    USER = {
        "username": "TestRegisterUser",
        "password": "TestRegisterPassword",
    }

    def setUp(self) -> None:
        res = requests.post(f"{BASE_URL}{REGISTER_PATH}",
                            json=self.USER, timeout=10)
        self.assertEqual(res.status_code, 201)

        data = res.json()

        self.token = data["token"]

    def tearDown(self) -> None:
        headers = {
            "Authorization": f"Bearer {self.token}"
        }
        res = requests.delete(f"{BASE_URL}{ME_PATH}",
                              headers=headers, timeout=10)
        self.assertEqual(res.status_code, 204)

    def test_register(self):
        res = requests.post(f"{BASE_URL}{REGISTER_PATH}",
                            json={
                                "username": "TestRegisterUser2",
                                "password": "TestRegisterPassword2"
        }, timeout=10)
        self.assertEqual(res.status_code, 201)

        data = res.json()
        self.assertIn("token", data)

        res = requests.delete(
            f"{BASE_URL}{ME_PATH}",
            headers={"Authorization": f"Bearer {data["token"]}"},
            timeout=10
        )
        self.assertEqual(res.status_code, 204)

    def test_register_existing_user(self):
        res = requests.post(f"{BASE_URL}{REGISTER_PATH}",
                            json=self.USER, timeout=10)
        self.assertEqual(res.status_code, 400)

    def test_register_empty_data(self):
        res = requests.post(f"{BASE_URL}{REGISTER_PATH}", json={}, timeout=10)

        self.assertEqual(res.status_code, 400)


class TestMe(unittest.TestCase):
    USER = {
        "username": "TestMeUser",
        "password": "TestMePassword",
    }

    def setUp(self) -> None:
        res = requests.post(f"{BASE_URL}{REGISTER_PATH}",
                            json=self.USER, timeout=10)
        self.assertEqual(res.status_code, 201)

        data = res.json()

        self.token = data["token"]

    def tearDown(self) -> None:
        headers = {
            "Authorization": f"Bearer {self.token}"
        }
        res = requests.delete(f"{BASE_URL}{ME_PATH}",
                              headers=headers, timeout=10)
        self.assertEqual(res.status_code, 204)

    def test_me(self):
        headers = {
            "Authorization": f"Bearer {self.token}"
        }
        res = requests.get(f"{BASE_URL}{ME_PATH}", headers=headers, timeout=10)
        self.assertEqual(res.status_code, 200)

        data = res.json()
        self.assertEqual(data["username"], self.USER["username"])

    def test_me_invalid_token(self):
        headers = {
            "Authorization": "Bearer invalid"
        }
        res = requests.get(f"{BASE_URL}{ME_PATH}", headers=headers, timeout=10)
        self.assertEqual(res.status_code, 401)
