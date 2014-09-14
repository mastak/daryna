from tornado.web import url

from user.handlers import UserHandler, UserLoginHandler


url_patterns = [
    url(r"/user/login/?$", UserLoginHandler, name="user-login"),

    url(r"/api/user/([0-9]+)/?$", UserHandler, name="user-item"),
    url(r"/api/user/(current)/?$", UserHandler, name="user-current"),
    url(r"/api/user/?$", UserHandler, name="user-list"),
]
