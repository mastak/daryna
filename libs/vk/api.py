import functools
import urllib.parse as urllib_parse

from tornado import httpclient, escape
from tornado.auth import AuthError, _auth_return_future

from settings import VK_CLIENT_ID, VK_CLIENT_SECRET


class VkAPI:
    """VK api class.
    oAuth dialog opening by client side
    """
    _VK_BASE_URL = "https://api.vk.com/method"
    _VK_API_VERSION = '5.24'
    _VK_USER_FIELDS = {'id': 'user_id', 'first_name': 'name', 'photo_100': 'avatar'}

    def __init__(self, access_token):
        self.access_token = access_token
        self.client_id = VK_CLIENT_ID
        self.client_secret = VK_CLIENT_SECRET

    @_auth_return_future
    def get_user(self, callback, user_id=None, extra_fields=None):
        user_ids = user_id is not None and [str(user_id)] or None
        self._get_users(callback, user_ids, extra_fields=extra_fields, index=0)

    @_auth_return_future
    def get_users(self, callback, user_ids=None, extra_fields=None):
        self._get_users(callback, user_ids, extra_fields)

    def _get_users(self, future, user_ids=None, extra_fields=None, index=None):
        fields = self._VK_USER_FIELDS
        if extra_fields is not None:
            fields.update(extra_fields)

        method_params = dict(fields=",".join(fields.keys()))
        if user_ids:
            method_params['user_ids'] = ",".join(user_ids)

        self.vk_request(
            path="/users.get",
            callback=functools.partial(self._on_get_users, future, fields, index),
            **method_params
        )

    def _on_get_users(self, future, fields, index, data):
        if data is None:
            future.set_result(None)
            return
        print('fields', fields)
        users_data = []
        for user_data in data['response']:
            users_data.append({key: user_data.get(field) for field, key in fields.items()})
        if index is not None:
            future.set_result(users_data[index])
        else:
            future.set_result(users_data)

    @_auth_return_future
    def vk_request(self, path, callback, post_args=None, **args):
        """Fetches the given relative API path"

        If the request is a POST, ``post_args`` should be provided. Query
        string arguments should be given as keyword arguments.
        """
        url = self._VK_BASE_URL + path
        all_args = {
            'v': self._VK_API_VERSION,
            'access_token': self.access_token
        }
        all_args.update(args)
        url += "?" + urllib_parse.urlencode(all_args)

        callback = functools.partial(self._on_vk_request, callback)
        if post_args is None:
            self.http_client.fetch(url, callback=callback)
        else:
            self.http_client.fetch(url, method="POST", body=urllib_parse.urlencode(post_args),
                                   callback=callback)

    def _on_vk_request(self, future, response):
        if response.error:
            future.set_exception(AuthError("Error response %s fetching %s" %
                                           (response.error, response.request.url)))
            return

        future.set_result(escape.json_decode(response.body))

    @property
    def http_client(self):
        if getattr(self, '_http_client', None) is None:
            self._http_client = httpclient.AsyncHTTPClient()
        return self._http_client

