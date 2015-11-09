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

    Just render the home template, and then js will fetch data from server
    to build the list or other things.

    Attributes:
    """
    def get(self):
        # headers = {'Content-Type': 'text/html'}
        return make_response(render_template('home.html'))
