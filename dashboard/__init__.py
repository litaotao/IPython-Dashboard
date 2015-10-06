# -*- coding: utf-8 -*-

# built-in package

# third-parth package
import redis
from flask import Flask
from flask.ext.restful import Api

# user-defined package
import config

'''
dashboard server setup
'''
app = Flask(__name__)
api = Api(app)



'''
dashboard common services setup
'''
r = redis.Redis(host=config.redis_host, port=config.redis_port, db=config.redis_db)


# import modules
import client, server
