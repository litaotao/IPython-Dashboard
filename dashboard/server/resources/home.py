# -*- coding: utf-8 -*-

# built-in package
import json
import time

# third-party package
from flask import render_template, make_response, request, redirect
from flask.ext.restful import Resource

# user-defined package
from dashboard import r_db, config
from ..utils import build_response


class Home(Resource):
    """home page

    Just render the home template, and then js will fetch data from server
    to build the list or other things.

    Attributes:
    """
    def get(self):
        return make_response(render_template('home.html'))

    def post(self):
        post_data = request.json
        self.create_dash(post_data.get('name'), post_data.get('author'))
        return redirect('/')

    def create_dash(self, name, author):
        tmp_time = time.time()
        meta = {'author': author, 'name': name, 'time_modified': tmp_time}
        default_option = {"x": [], "y": []}
        content = {"0": {"x": 0, "y": 5, "width": 6, "height": 5, "key": "none", "type": "none", "option": default_option},
                   "1": {"x": 6, "y": 5, "width": 6, "height": 5, "key": "none", "type": "none", "option": default_option},
                   "2": {"x": 0, "y": 0, "width": 6, "height": 5, "key": "none", "type": "none", "option": default_option},
                   "3": {"x": 6, "y": 0, "width": 6, "height": 5, "key": "none", "type": "none", "option": default_option},
                  }

        dash_id = r_db.zcount(config.DASH_ID_KEY, '-inf', '+inf') + 1
        meta['time_modified'] = tmp_time
        meta['id'] = dash_id
        meta['author'] = author
        meta['name'] = name
        for i in content:
            content[i].update({'graph_name': 'graph name ' + i, 'id': i})

        content = dict(grid=content, name=meta['name'], id=dash_id)
        r_db.zadd(config.DASH_ID_KEY, dash_id, tmp_time)
        r_db.hset(config.DASH_META_KEY, dash_id, json.dumps(meta))
        r_db.hset(config.DASH_CONTENT_KEY, dash_id, json.dumps(content))

        return meta


class DashListData(Resource):
    """Get dashboard list.

    Get the dashboard list with meta information, which is used for rendering
    kinds of `current dashboard list` page.

    DB structure:
    1. DASH_ID_KEY -> Sorted Set : time_modified -> dash_id
    2. DASH_META_KEY -> hash : dash_id -> dash meta info
    3. DASH_CONTENT_KEY -> hash : dash_id -> dash content info [ like ipydb format ]

    Attributes:
    """
    def get(self, page=0, size=10):
        """Get dashboard meta info from in page `page` and page size is `size`.

        Args:
            page: page number.
            size: size number.

        Returns:
            list of dict containing the dash_id and accordingly meta info.
            maybe empty list [] when page * size > total dashes in db. that's reasonable.
        """
        dash_list = r_db.zrevrange(config.DASH_ID_KEY, 0, -1, True)
        id_list = dash_list[page * size : page * size + size]
        dash_meta = []
        data = []
        if id_list:
            dash_meta = r_db.hmget(config.DASH_META_KEY, [i[0] for i in id_list])
            data = [json.loads(i) for i in dash_meta]

        return build_response(dict(data=data, code=200))
