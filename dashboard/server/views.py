# -*- coding: utf-8 -*-

from dashboard import api
from resources.storage import Key, KeyList
from resources.dash import Dash, DashList


'''
# Restful API
'''
api.add_resource(KeyList, '/keys/', '/keylist/')
api.add_resource(Key, '/keys/<string:key>')
api.add_resource(DashList, '/dashes/', '/dashlist/')
api.add_resource(Dash, '/dashes/<string:dash_id>')
