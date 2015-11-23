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


class Sql(Resource):
    """sql html render.

    return the rendered sql template id

    Attributes:
    """
    def get(self):
        return make_response(render_template('sql.html'))
