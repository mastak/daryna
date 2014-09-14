import tornado.gen

from db.exceptions import ObjectDoesNotExist

from user.models import User, AnonymousUser
from user.exceptions import UserDoesNotExist


@tornado.gen.coroutine
def get_user(handler):
    if 'pk' in handler.session:
        try:
            return (yield User.load(pk=handler.session['pk']))
        except ObjectDoesNotExist:
            return AnonymousUser()
    return AnonymousUser()


@tornado.gen.coroutine
def authenticate(user_id, **credentials):
    try:
        return (yield User.find_one(social_ids=user_id))
    except ObjectDoesNotExist:
        raise UserDoesNotExist


@tornado.gen.coroutine
def create(name, email, avatar, social_ids=None, social_accounts=None):
    user = User(
        name=name,
        email=email,
        avatar=avatar,
        social_ids=social_ids or [],
        social_accounts=social_accounts or []
    )
    yield user.save()
    return user
