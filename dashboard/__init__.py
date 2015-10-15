# -*- coding: utf-8 -*-

# built-in package

# third-parth package
import redis
from flask import Flask
from flask.ext.restful import Api

# user-defined package
import config as cfg

'''
dashboard server setup
'''
app = Flask(__name__)
api = Api(app)


'''
dashboard common services setup
'''
r_kv = redis.Redis(host=cfg.redis_kv_host, port=cfg.redis_kv_port, db=cfg.redis_kv_db)
r_db = redis.Redis(host=cfg.redis_db_host, port=cfg.redis_db_port, db=cfg.redis_db_db)


# import modules
import client, server
