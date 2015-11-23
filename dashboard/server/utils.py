# -*- coding: utf-8 -*-

# built-in package
import os
import time
import json
import random
from functools import wraps

# third-party package
from flask import make_response, jsonify

# user-defined package


def build_response(content, code=200):
    """Build response, add headers"""
    response = make_response( jsonify(content), content['code'] )
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = \
            'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    return response


color_set = {
    "red": u"\033[1;31m{}\033[0m", "green": u"\033[1;32m{}\033[0m",
    "yellow":u"\033[1;33m{}\033[0m", "blue": u"\033[1;34m{}\033[0m",
    "magenta": u"\033[1;35m{}\033[0m", "cyan": u"\033[1;36m{}\033[0m",
    "white": u"\033[1;37m{}\033[0m",
}


def print_info(text, color='white', kill=False):
    global color_set
    print 'color:', color  # for debug from logfile
    template = color_set.get(color)
    print template.format(text)
    if kill:
        exit(-1)

'''
# A simple wrapper, print func name when been executed.
'''
def print_func_name(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print '\n###start run fun:  {} ...'.format(func.__name__)
        result = func(*args, **kwargs)
        print '\n###finish run fun:  {} ...'.format(func.__name__)
        return result
    return wrapper
