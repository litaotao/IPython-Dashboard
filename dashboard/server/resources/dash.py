# -*- coding: utf-8 -*-

# built-in package
import time
import json
import random
import hashlib

# third-party package
from flask import request, make_response, render_template
from flask.ext.restful import Resource

# user-defined package
from dashboard import r_db, config
from ..utils import build_response, print_info


class DashList(Resource):
    """Get dashboard list
    Sorted Set, score->member : time_modified->id
    """
    def get(self, page=0, size=10):
        '''Get dashboard list in db.
        '''
        dash_list = r_db.zrevrange(config.DASH_ID_KEY, 0, -1, True)
        id_list = dash_list[page * size : page * size + size]
        dash_meta = r_db.hmget(config.DASH_META_KEY, [i[0] for i in id_list])
        data = [json.loads(i) for i in dash_meta]

        return build_response(dict(data=data, code=200))


class Dash(Resource):
    """dashboard content CURD operations
    """
    def get(self, dash_id):
        '''Get a dashboard from db according to the dash id name.
        '''
        return make_response(render_template('dashboard.html', dash_id=dash_id))


class DashData(Resource):
    """dashboard content CURD operations
    """
    def get(self, dash_id):
        '''Get a dashboard from db according to the dash id name.
        '''
        data = json.loads(r_db.hmget(config.DASH_CONTENT_KEY, dash_id)[0])
        return build_response(dict(data=data, code=200))

    def post(self, dash_id):
        '''Update a dash configure, return updated dash configure
        '''
        # import ipdb; ipdb.set_trace()
        data = request.get_json()
        current_time = time.time()
        _hash = hashlib.sha256()
        _hash.update(current_time.__repr__())
        data['id'] = _hash.hexdigest()

        # store meta and content info
        test_data = str(random.randint(1, 100))
        meta = {'author': 'author-' + test_data, 
                'name': 'name-' + test_data, 
                'time_modified': int(current_time)}
        content = data

        r_db.hset(config.DASH_META_KEY, data['id'], json.dumps(meta))
        r_db.hset(config.DASH_CONTENT_KEY, data['id'], json.dumps(content))

        return build_response(dict(data=data['id'], code=200))

    def put(self, dash_id=0):
        '''Create a new dash, return dash id
        '''
        data = request.get_json()
        current_time = time.time()
        # test_data = str(random.randint(1, 100))
        meta = {'author': 'author-' + dash_id, 
                'name': 'name-' + dash_id, 
                'time_modified': int(current_time),
                'id': dash_id}

        r_db.hset(config.DASH_META_KEY, dash_id, json.dumps(meta))
        r_db.hset(config.DASH_CONTENT_KEY, dash_id, json.dumps(data))

        return build_response(dict(data=dash_id, code=200))

