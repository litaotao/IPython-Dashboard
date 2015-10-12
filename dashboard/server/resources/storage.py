# -*- coding: utf-8 -*-

# built-in package
import json

# third-party package
from flask.ext.restful import Resource

# user-defined package
from dashboard import r_kv
from ..utils import build_response


class KeyList(Resource):
    """Get storage list
    """
    def get(self):
        '''Get key list in storage.
        '''
        keys = r_kv.keys()
        keys.sort()
        return build_response(dict(data=keys, code=200))

class Key(Resource):
    """Storage CURD operations
    """
    def get(self, key):
        '''Get a key-value from storage according to the key name.
        '''
        data = r_kv.get(key)
        data = json.dumps(data) if isinstance(data, str) else data
        data = json.loads(data) if data else {}

        return build_response(dict(data=data, code=200))



