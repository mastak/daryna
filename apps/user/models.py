from copy import deepcopy

from db.models import Model


class AnonymousUser():

    id = None
    name = None
    avatar = None

    def is_authenticated(self):
        return False


class User(Model):

    def __init__(self, name, email, avatar, **kwargs):
        super().__init__(**kwargs)
        self.name = name
        self.email = email
        self.avatar = avatar
        self.social_ids = 'social_ids' in kwargs and deepcopy(kwargs['social_ids']) or []
        social_accounts = kwargs.pop('social_accounts', None)
        self.social_accounts = deepcopy(social_accounts) if social_accounts is not None else []

    def is_authenticated(self):
        return True

    @property
    def data(self):
        data = {
            'name': self.name,
            'email': self.email,
            'avatar': self.avatar,
            'social_ids': self.social_ids,
            'social_accounts': self.social_accounts
        }
        if self.pk is not None:
            data['_id'] = data['pk'] = self.pk
        return data
