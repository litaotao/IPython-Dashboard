# -*- coding: utf-8 -*-

# built-in package
import json

# third-party package
from flask import render_template, make_response
from flask.ext.restful import Resource

# user-defined package
from dashboard import r_db, config
from ..utils import build_response


class Status(Resource):
    """just for rest api test use
    """
    def get(self):
        return build_response(dict(data="hello, world", code=200))
