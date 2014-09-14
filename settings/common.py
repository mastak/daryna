import logging
import os
from tornado.options import options


DEBUG = options.debug or False

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
path = lambda *a: os.path.join(ROOT, *a)

STATIC_URL = "/static/"
STATIC_PATH = path("static")
MEDIA_PATH = path('media')
TEMPLATE_PATH = path('templates')

LOGIN_URL = 'http://ilubimov.name/user/login/'

COOKIE_SECRET = "Sn|MAYX3Yxtjn?tg5K1SWII~YX~zJGI%ukvNbOIk3}sPuinuN51%j9LD5oTp"
XSRF_COOKIES = True
DEFAULT_HANDLER_CLASS = None
DEFAULT_HANDLER_ARGS = None

MONGODB = {
    'host': '127.0.0.1',
    'port': '27017',
    'name': 'daryna',
}

LOGGERS = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "simple": {
            "format": "%(asctime)s %(name)-15s %(levelname)-8s %(processName)-10s %(message)s"
        }
    },

    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "level": "DEBUG",
            "formatter": "simple",
            "stream": "ext://sys.stdout"
        }
    },

    "loggers": {
        "transmit": {
            "level": "DEBUG",
            "propagate": False,
            "handlers": ["console"]
        },
    },

    "root": {
        "level": "INFO",
        "handlers": ["console"]
    }
}


SYSLOG_TAG = "transmit"
SYSLOG_FACILITY = logging.handlers.SysLogHandler.LOG_LOCAL2

if DEBUG:
    LOG_LEVEL = logging.DEBUG
else:
    LOG_LEVEL = logging.INFO
USE_SYSLOG = True
