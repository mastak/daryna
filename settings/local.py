from tornado import gen
import tornado.web
from settings import STATIC_PATH

DEBUG = True


class IndexHtmlHandler(tornado.web.StaticFileHandler):
    @gen.coroutine
    def get(self):
        yield super(IndexHtmlHandler, self).get('index.html')

DEFAULT_HANDLER_CLASS = IndexHtmlHandler
DEFAULT_HANDLER_ARGS = {'path': STATIC_PATH}