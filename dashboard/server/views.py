# -*- coding: utf-8 -*-

from dashboard import api
from resources.storage import Key, KeyList
from resources.dash import Dash, DashList, DashData
from resources.home import Home
from resources.test import Test



'''
# Restful API
'''
api.add_resource(Home, '/')
api.add_resource(KeyList, '/keys/')
api.add_resource(Key, '/key/<string:key>')
api.add_resource(DashList, '/data/dashes/')
api.add_resource(Dash, '/dash/<string:dash_id>')
api.add_resource(DashData, '/data/dash/<string:dash_id>')
api.add_resource(Test, '/home')