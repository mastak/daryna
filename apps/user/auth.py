from user.models import User, AnonymousUser
from user.exceptions import UserNotFound


def get_user(handler):
    if 'user_id' in handler.session:
        try:
            return User(pk=handler.session['user_id'])
        except UserNotFound:
            return AnonymousUser
    return AnonymousUser
