import tornado.gen

import db
from db.exceptions import ObjectDoesNotExist


class Model:

    def __init__(self, **kwargs):
        self.pk = kwargs.pop('pk', None)

    @property
    def data(self):
        raise NotImplemented

    @classmethod
    @tornado.gen.coroutine
    def load(cls, pk):
        return (yield cls.find_one(_id=pk))

    @classmethod
    @tornado.gen.coroutine
    def find_one(cls, **filters):
        data = yield cls.collection().find_one(filters)
        if not data:
            raise ObjectDoesNotExist
        return cls(pk=data.pop('_id'), **data)

    @classmethod
    def collection(cls):
        collection_name = cls.__name__.lower()
        return getattr(db.DB, collection_name)

    @tornado.gen.coroutine
    def save(self):
        self.pk = yield self.collection().insert(self.data)
        return self
