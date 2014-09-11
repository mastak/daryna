from db.models import Model


class AnonymousUser():

    id = None
    name = None
    avatar = None

    def is_authenticated(self):
        return False


class User(Model):

    def __init__(self, pk, name, avatar, **kwargs):
        self.pk = pk
        self.name = name
        self.avatar = avatar
        self.data = kwargs

    def is_authenticated(self):
        return True
