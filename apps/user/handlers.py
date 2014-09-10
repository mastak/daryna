import tornado.auth
import tornado.web
import tornado.gen
import tornado.httputil

from utils.web import BaseHandler


class User(BaseHandler):
    @tornado.gen.coroutine
    def get(self):
        pass
