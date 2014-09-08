import tornado
import tornado.web
import tornado.template
from tornado.options import define, options

from settings import environment
import logconfig


define("port", default=8888, help="run on the given port", type=int)
define("config", default=None, help="tornado config file")
define("debug", default=False, help="debug mode")
tornado.options.parse_command_line()

from settings.common import *
from settings.cdn import *
try:
    from settings.local import *
except ImportError:
    pass
logconfig.initialize_logging(SYSLOG_TAG, SYSLOG_FACILITY, LOGGERS, LOG_LEVEL, USE_SYSLOG)
from utils.web import NoCacheStaticHandler

tornado_app_settings = {}
tornado_app_settings['debug'] = DEBUG
tornado_app_settings['static_hash_cache'] = DEBUG
tornado_app_settings['static_path'] = STATIC_PATH
tornado_app_settings['cookie_secret'] = "your-cookie-secret"
tornado_app_settings['xsrf_cookies'] = True
tornado_app_settings['default_handler_class'] = DEFAULT_HANDLER_CLASS
tornado_app_settings['default_handler_args'] = DEFAULT_HANDLER_ARGS
tornado_app_settings['static_handler_class'] = NoCacheStaticHandler
tornado_app_settings['template_loader'] = tornado.template.Loader(TEMPLATE_PATH)


if options.config:
    tornado.options.parse_config_file(options.config)