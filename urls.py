from tornado.web import url

from user.handlers import UserHandler


url_patterns = [
    url(r"/api/user/([0-9]+)/?$", UserHandler, name="user"),
    url(r"/api/user/(current)/?$", UserHandler, name="user"),
    url(r"/api/user/?$", UserHandler, name="user"),
]
