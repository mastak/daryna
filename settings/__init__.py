import datetime

import tornado
import tornado.web
import tornado.template
from tornado.options import define, options

from settings import environment


define("port", default=8888, help="run on the given port", type=int)
define("config", default=None, help="tornado config file")
define("debug", default=False, help="debug mode")
tornado.options.parse_command_line()

DEBUG = False

from settings.common import *
from settings.cdn import *
from settings.social import *
try:
    from settings.local import *
except ImportError:
    pass


class NoCacheStaticHandler(tornado.web.StaticFileHandler):
    """ Request static file handlers for development and debug only.
    It disables any caching for static file.
    """
    def set_extra_headers(self, path):
        self.set_header('Cache-Control', 'no-cache, must-revalidate')
        self.set_header('Expires', '0')
        now = datetime.datetime.now()
        expiration = datetime.datetime(now.year-1, now.month, now.day)
        self.set_header('Last-Modified', expiration)


tornado_app_settings = {}
tornado_app_settings['debug'] = DEBUG
tornado_app_settings['static_hash_cache'] = DEBUG
tornado_app_settings['static_path'] = STATIC_PATH
tornado_app_settings['cookie_secret'] = "H?4Mx~RiC{7gLpPVz}0u25niA3*##g3vJXrm7al~tbzem8*CC42pW{bAt"
tornado_app_settings['xsrf_cookies'] = True
tornado_app_settings['login_url'] = LOGIN_URL
tornado_app_settings['default_handler_class'] = DEFAULT_HANDLER_CLASS
tornado_app_settings['default_handler_args'] = DEFAULT_HANDLER_ARGS
tornado_app_settings['static_handler_class'] = DEBUG and NoCacheStaticHandler or None
tornado_app_settings['template_loader'] = tornado.template.Loader(TEMPLATE_PATH)

tornado_app_settings['pycket'] = {
    'engine': 'redis',
    'storage': {
        'host': 'localhost',
        'port': 6379,
        'db_sessions': 10,
        'db_notifications': 11,
        'max_connections': 2 ** 31,
    },
    'cookies': {
        'expires_days': 120,
    },
}

if options.config:
    tornado.options.parse_config_file(options.config)
