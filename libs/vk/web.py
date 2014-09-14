import json
import functools

from tornado import httpclient, escape
from tornado.auth import OAuth2Mixin, AuthError, _auth_return_future

from settings import LOGIN_URL, VK_CLIENT_ID, VK_CLIENT_SECRET


class VkOAuth2Mixin(OAuth2Mixin):
    """VK authentication using the OAuth2.
    oAuth dialog opening by client side
    """
    _OAUTH_ACCESS_TOKEN_URL = "https://oauth.vk.com/access_token?"
    _OAUTH_NO_CALLBACKS = False

    @_auth_return_future
    def get_user_data(self, code, callback):
        """Handles the login for the Vkontakte user, returning a user object.
        """
        url = self._oauth_request_token_url(
            redirect_uri=LOGIN_URL,
            client_id=VK_CLIENT_ID,
            client_secret=VK_CLIENT_SECRET,
            code=code
        )
        self.http_client.fetch(url, functools.partial(self._on_access_token, callback))

    def _on_access_token(self, future, response):
        if response.error:
            future.set_exception(AuthError('vk auth error: %s' % str(response)))
            return
        users_data = json.loads(escape.native_str(response.body))
        future.set_result(users_data)

    @property
    def http_client(self):
        if getattr(self, '_http_client', None) is None:
            self._http_client = httpclient.AsyncHTTPClient()
        return self._http_client
