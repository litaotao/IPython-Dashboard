# -*- coding: utf-8 -*-

from dashboard import api
from models.storage import Storage, StorageList


'''
# Restful API
'''
api.add_resource(Storage, '/storage/<string:key>')
api.add_resource(StorageList, '/storage')