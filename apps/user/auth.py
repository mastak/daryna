from db.exceptions import ObjectDoesNotExist

from user.models import User, AnonymousUser


def get_user(handler):
    if 'user_id' in handler.session:
        try:
            return User.load(pk=handler.session['user_id'])
        except ObjectDoesNotExist:
            return AnonymousUser()
    return AnonymousUser()
