# -*- coding: utf-8 -*-

# built-in package
import json

# third-party package
from flask.ext.restful import Resource

# user-defined package
from dashboard import r_db, config
from ..utils import build_response


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
        # data = [json.loads(i) for i in dash_meta]
        data = [eval(i) for i in dash_meta]


        return build_response(dict(data=data, code=200))


class Dash(Resource):
    """dashboard content CURD operations
    """
    def get(self, dash_id):
        '''Get a dashboard from db according to the dash id name.
        '''
        # data = json.loads(r_db.hmget(config.DASH_CONTENT_KEY, dash_id))
        data = eval(r_db.hmget(config.DASH_CONTENT_KEY, dash_id)[0])

        return build_response(dict(data=data, code=200))



