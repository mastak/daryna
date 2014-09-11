import tornado.gen

import db
from db.exceptions import ObjectDoesNotExist


class Model:

    @classmethod
    @tornado.gen.coroutine
    def load(cls, pk):
        data = yield db.DB.users.find_one({'_id': pk})
        if not data:
            raise ObjectDoesNotExist
        return cls(data.pop('_id'), **data)
