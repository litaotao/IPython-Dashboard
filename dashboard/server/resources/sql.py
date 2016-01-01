# -*- coding: utf-8 -*-

# built-in package
import time
import json
import random
import hashlib

# third-party package
import sqlparse
from pygments import highlight
from pygments.lexers import SqlLexer
from pygments.formatters import HtmlFormatter
from flask.ext.restful import Resource
from flask import request, make_response, render_template, redirect

# user-defined package
from dashboard import r_db, config
from ..utils import build_response, print_info, SQL


class Sql(Resource):
    """sql html render.

    return the rendered sql template id

    Attributes:
    """
    def get(self):
        return make_response(render_template('sql.html', api_root=config.app_host))


class SqlData(Resource):
    """sql executor.

    return the result of executed sql

    Attributes:
    """
    def post(self):
        '''return executed sql result to client.

        post data format:

            {"options": ['all', 'last', 'first', 'format'], "sql_raw": "raw sql ..."}

        Returns:
            sql result.
        '''
        ## format sql

        data = request.get_json()
        options, sql_raw = data.get('options'), data.get('sql_raw')

        if options == 'format':
            sql_formmated = sqlparse.format(sql_raw, keyword_case='upper', reindent=True)
            return build_response(dict(data=sql_formmated, code=200))

        elif options in ('all', 'selected'):
            conn = SQL(config.sql_host, config.sql_port, config.sql_user,
                       config.sql_pwd, config.sql_db)

            result = conn.run(sql_raw)
            return build_response(dict(data=result, code=200))
        else:

            pass







        pass





##
