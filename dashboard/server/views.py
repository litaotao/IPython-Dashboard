# -*- coding: utf-8 -*-

from dashboard import api
from resources.storage import Key, KeyList


'''
# Restful API
'''
api.add_resource(KeyList, '/keys', '/keylist')
api.add_resource(Key, '/key/<string:key>')
