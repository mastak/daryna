import tornado.gen
from tornado.web import StaticFileHandler

from utils.web import BaseHandler
from vk.web import VkOAuth2Mixin
from vk.api import VkAPI

from user import models
from user.auth import authenticate, create
from user.exceptions import UserDoesNotExist
from settings import STATIC_PATH


class UserHandler(BaseHandler):

    @tornado.gen.coroutine
    def get(self, pk=None):
        if pk == 'current':
            user = self.user
        else:
            user = yield models.User.load(pk)
        self.write({
            'id': user.id,
            'name': user.name,
            'avatar': user.avatar,
            'is_authenticated': user.is_authenticated()
        })
        self.finish()


class UserLoginHandler(BaseHandler, VkOAuth2Mixin):

    @tornado.gen.coroutine
    def get(self, user_id=None, **kwargs):
        code = self.get_argument("code", False)
        if code and not self.user.is_authenticated():
            user_credentials = yield self.get_user_data(code=code)
            try:
                user = yield authenticate(**user_credentials)
            except UserDoesNotExist:
                vk = VkAPI(user_credentials['access_token'])
                social_account = yield vk.get_user(user_id=user_credentials['user_id'])
                social_account.update(user_credentials)
                user = yield create(
                    name=social_account['name'],
                    email=social_account['email'],
                    avatar=social_account['avatar'],
                    social_ids=[social_account['user_id']],
                    social_accounts=[social_account]
                )
            if user:
                self.login(user)
        yield self.static_handler('index.html')

    @tornado.gen.coroutine
    def static_handler(self, path):
        handler = StaticFileHandler(self.application, self.request, path=STATIC_PATH)
        transforms = [t(self.request) for t in self.application.transforms]
        yield handler._execute(transforms, path)
