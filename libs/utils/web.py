import logging

import tornado.web
from pycket.session import SessionMixin

from user.auth import get_user

logger = logging.getLogger('request.' + __name__)


class BaseHandler(tornado.web.RequestHandler, SessionMixin):
    """
    A class to collect common handler methods - all other handlers should subclass this one.
    """

    def __init__(self, application, request, **kwargs):
        super().__init__(application, request, **kwargs)
        self.user = get_user(self)
