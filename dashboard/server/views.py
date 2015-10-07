# -*- coding: utf-8 -*-

from dashboard import api
from models.storage import Key, KeyList


'''
# Restful API
'''
api.add_resource(KeyList, '/keys')
api.add_resource(Key, '/key/<string:key>')
