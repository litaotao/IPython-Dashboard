# -*- coding: utf-8 -*-

# built-in package
import json

# third-party package
from flask.ext.restful import Resource

# user-defined package
from dashboard import r
from ..utils import build_response


class DashList(Resource):
    """Get dashboard list
    """
    def get(self):
        '''Get dashboard list in db.
        '''
        return ''

class Dash(Resource):
    """dashboard CURD operations
    """
    def get(self, dash_id):
        '''Get a dashboard from db according to the dash id name.
        '''
        return ''



