# -*- coding: utf-8 -*-

from .. import api
from .resources.storage import Key, KeyList
from .resources.dash import Dash, DashData
from .resources.home import Home, DashListData
from .resources.status import Status


'''
# Restful API
'''
# home page
api.add_resource(Home, '/', '/dashes')
api.add_resource(DashListData, '/data/dashes/')

# dash page
api.add_resource(KeyList, '/keys/')
api.add_resource(Key, '/key/<string:key>')
api.add_resource(Dash, '/dash/<string:dash_id>')
api.add_resource(DashData, '/data/dash/<string:dash_id>')
api.add_resource(Status, '/__info__')
