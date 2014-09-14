import logging

import tornado.gen
import tornado.web
from pycket.session import SessionMixin

from user.auth import get_user

logger = logging.getLogger('transmit.' + __name__)


class BaseHandler(tornado.web.RequestHandler, SessionMixin):
    """
    A class to collect common handler methods - all other handlers should subclass this one.
    """

    def __init__(self, application, request, **kwargs):
        super().__init__(application, request, **kwargs)
        self.user = None
        self.db = self.settings['db']

    @tornado.gen.coroutine
    def prepare(self):
        self.user = yield get_user(self)

    def login(self, user):
        self.session['pk'] = user.pk
