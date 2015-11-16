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


def color_console(code):
    def inner(text, bold=False):
        c = code
        if bold:
            c = "1;%s" % c
        return "\033[%sm%s\033[0m" % (c, text)
    return inner

color_set = {'red': color_console('31'), 'green': color_console('32'),
             'yellow': color_console('33'), 'blue': color_console('34'),
             'magenta': color_console('35'), 'cyan': color_console('36'),
             'white': color_console('37')}

def print_info(text, color='white', kill=False):
    global color_set
    print 'color:', color  # for debug from logfile
    print color_set.get(color)(text)
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
