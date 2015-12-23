# -*- coding: utf-8 -*-

from flask import request

from .. import api, app, log
from .resources.storage import Key, KeyList
from .resources.dash import Dash, DashData
from .resources.home import Home, DashListData
from .resources.status import Status
from .resources.sql import Sql, SqlData


@app.after_request
def after(response):
    log.access.info(u'end :{} {}\n'.format(request.remote_addr, request.url))
    return response


@app.before_request
def before():
    log.access.info(u'start :{} {}'.format(request.remote_addr, request.url))


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

# sql page
api.add_resource(Sql, '/sql/')
api.add_resource(SqlData, '/data/sql/')

# server info
api.add_resource(Status, '/__info__')
