# -*- coding: utf-8 -*-

# built-in package
import json

# third-party package
from flask.ext.restful import Resource

# user-defined package
from dashboard import r


class KeyList(Resource):
    """Get storage list
    """
    def get(self):
        '''Get key list in storage.
        '''
        return r.keys()


class Key(Resource):
    """Storage CURD operations
    """
    def get(self, key):
        '''Get a key-value from storage according to the key name.
        '''
        data = r.get(key)
        data = json.loads(data) if data else {}

        return data



