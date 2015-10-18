# -*- coding: utf-8 -*-

# built-in package
import json

# third-party package
from flask import render_template, make_response
from flask.ext.restful import Resource

# user-defined package
from dashboard import r_db, config
from ..utils import build_response


class Home(Resource):
    """home page
    """
    def get(self):
        # headers = {'Content-Type': 'text/html'}
        return make_response(render_template('dashboard_list.html'))



