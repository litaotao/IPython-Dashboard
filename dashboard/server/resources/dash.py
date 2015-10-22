# -*- coding: utf-8 -*-

# built-in package
import time
import json
import random
import hashlib

# third-party package
from flask import request, make_response, render_template, redirect
from flask.ext.restful import Resource

# user-defined package
from dashboard import r_db, config
from ..utils import build_response, print_info


class Dash(Resource):
    """Dashboard html render.

    return the dashboard id, let js do the other work.

    Attributes:
    """
    def get(self, dash_id):
        """Just return the dashboard id in the rendering html.

        JS will do other work [ajax and rendering] according to the dash_id.

        Args:
            dash_id: dashboard id.

        Returns:
            rendered html.
        """
        return make_response(render_template('dashboard.html', dash_id=dash_id))


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
        dash_meta = r_db.hmget(config.DASH_META_KEY, [i[0] for i in id_list])
        data = [json.loads(i) for i in dash_meta]

        return build_response(dict(data=data, code=200))


class DashData(Resource):
    """Dashboard meta/content CRUD operation.

    Create, read, update and delete dash operation.

    Attributes:
    """
    def get(self, dash_id):
        """Read dashboard content.

        Args:
            dash_id: dashboard id.

        Returns:
            A dict containing the content of that dashboard, not include the meta info.
        """
        data = json.loads(r_db.hmget(config.DASH_CONTENT_KEY, dash_id)[0])
        return build_response(dict(data=data, code=200))

    def post(self, dash_id):
        """Create a dash meta and content, return created dash content.

        Args:
            dash_id: dashboard id.

        Returns:
            A dict containing the created content of that dashboard, not include the meta info.
        """
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
        """Update a dash meta and content, return updated dash content.

        Args:
            dash_id: dashboard id.

        Returns:
            A dict containing the updated content of that dashboard, not include the meta info.
        """
        data = request.get_json()
        current_time = time.time()

        meta = json.loads(r_db.hget(config.DASH_META_KEY, dash_id))
        meta.update({'name': '' + data['name'], 
                     'time_modified': int(current_time)})
        content = json.loads(r_db.hget(config.DASH_CONTENT_KEY, dash_id))
        content.update(data)

        r_db.hset(config.DASH_META_KEY, dash_id, json.dumps(meta))
        r_db.hset(config.DASH_CONTENT_KEY, dash_id, json.dumps(data))

        return build_response(dict(data=dash_id, code=200))

    def delete(self, dash_id):
        """Delete a dash meta and content, return updated dash content.

        Actually, just remove it to a specfied place in database.

        Args:
            dash_id: dashboard id.

        Returns:
            Redirect to home page.
        """
        removed_info = dict(
            time_modified = r_db.zscore(config.DASH_ID_KEY, dash_id),
            meta = r_db.hget(config.DASH_META_KEY, dash_id),
            content = r_db.hget(config.DASH_CONTENT_KEY, dash_id))
        r_db.zrem(config.DASH_ID_KEY, dash_id)
        r_db.hdel(config.DASH_META_KEY, dash_id)
        r_db.hdel(config.DASH_CONTENT_KEY, dash_id)

        return redirect('/')



