import tornado.auth
import tornado.web
import tornado.gen
import tornado.httputil

from utils.web import BaseHandler
from user import models


class UserHandler(BaseHandler):

    @tornado.gen.coroutine
    def get(self, user_id=None):
        print(user_id)
        if user_id == 'current':
            user = self.user
        else:
            user = yield models.User.load(pk=user_id)
        self.write({
            'id': user.id,
            'name': user.name,
            'avatar': user.avatar,
            'is_authenticated': user.is_authenticated()
        })
        self.finish()
