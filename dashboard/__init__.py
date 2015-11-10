# -*- coding: utf-8 -*-
from __future__ import absolute_import
# built-in package
import copy

# third-parth package
import redis
from flask import Flask
from flask.ext.restful import Api

# user-defined package
from . import config


'''
dashboard server setup
'''
# app = Flask("__name__", static_folder="./static", template_folder="./templates")
# app = Flask("dashboard", static_folder="./static", template_folder="./templates")
# app = Flask("dashboard")
app = Flask(__name__)
api = Api(app)


'''
dashboard common services setup
'''
r_kv = redis.Redis(host=config.redis_kv_host, port=config.redis_kv_port, db=config.redis_kv_db)
r_db = redis.Redis(host=config.redis_db_host, port=config.redis_db_port, db=config.redis_db_db)


# import modules
from . import client, server
