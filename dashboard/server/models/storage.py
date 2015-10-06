# -*- coding: utf-8 -*-

# third-party package
from flask.ext.restful import Resource

# user-defined package
from dashboard import r

class StorageList(Resource):
    """Get storage list
    """
    def get(self):
        '''Get key list in storage.
        '''
        return r.keys()


class Storage(Resource):
    """Storage CURD operations
    """
    def get(self, key):
        '''Get a key-value from storage according to the key name.
        '''
        return 'None'



