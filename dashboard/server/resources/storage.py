# -*- coding: utf-8 -*-

# built-in package
import json

# third-party package
from flask.ext.restful import Resource

# user-defined package
from dashboard import r_kv
from ..utils import build_response


class KeyList(Resource):
    """Get the keys in database.

    Return all the keys exist in database which are used to
    store data for build table and visualization. I.E, those
    data shared by users in ipython.

    Attributes:
    """
    def get(self):
        """Get key list in storage.
        """
        keys = r_kv.keys()
        keys.sort()
        return build_response(dict(data=keys, code=200))


class Key(Resource):
    """Get the data of a key.

    Get all the data of a key. Both Key and KeyList API has much to
    implement in future to make it more useable. namely, auto-complete
    for KeyList, and fetch part of data via a key for this API.

    Attributes:
    """
    def get(self, key):
        """Get a key-value from storage according to the key name.
        """
        data = r_kv.get(key)
        # data = json.dumps(data) if isinstance(data, str) else data
        # data = json.loads(data) if data else {}

        return build_response(dict(data=data, code=200))
