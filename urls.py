from user.handlers import User


url_patterns = [
    (r"api/user/current", User),
]