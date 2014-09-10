

class AnonymousUser():

    def is_authenticated(self):
        return False


class User():

    def __init__(self, pk):
        self.pk = pk

    def is_authenticated(self):
        return True
