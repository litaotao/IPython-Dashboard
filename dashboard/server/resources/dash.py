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
        return {'removed_info': removed_info}
        # return redirect('/')
