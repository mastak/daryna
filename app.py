import tornado.httpserver
import tornado.ioloop
import tornado.web
from tornado.options import options

from settings import tornado_app_settings
from urls import url_patterns


class DarynaApp(tornado.web.Application):
    def __init__(self):
        tornado.web.Application.__init__(self, url_patterns, **tornado_app_settings)


def main():
    app = DarynaApp()
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    main()
