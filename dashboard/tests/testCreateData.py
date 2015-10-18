# -*- coding: utf-8 -*-

# built-in package
import os
import time
import json
import random

# third-party package
import pandas as pd

# user-defined package
from dashboard import r_kv, r_db, config
from dashboard.server import utils


TMP_DIR = '/mnt/tmp'


@utils.print_func_name
def test_create_dataframe():
    url = 'https://github.com/litaotao/data-science/raw/master/examples/happy-healthy-hungry/data/SFBusinesses/businesses.csv'
    if os.path.isdir(TMP_DIR) and 'businesses.csv' in os.listdir(TMP_DIR):
        url = TMP_DIR + '/businesses.csv'
    data = pd.read_csv(url)
    piece_lenth = 1000
    for piece in range(len(data) / piece_lenth):
        key = 'businesses-{}'.format(piece)
        value = data[piece * piece_lenth : piece * piece_lenth + piece_lenth]
        r_kv.set(key, value.to_json())

    url_2 = 'https://github.com/litaotao/data-science/raw/master/examples/happy-healthy-hungry/data/SFBusinesses/inspections.csv'
    if os.path.isdir(TMP_DIR) and  'inspections.csv' in os.listdir(TMP_DIR):
        url = TMP_DIR + '/inspections.csv'
    data = pd.read_csv(url)
    piece_lenth = 1000
    for piece in range(len(data) / piece_lenth):
        key = 'inspections-{}'.format(piece)
        value = data[piece * piece_lenth : piece * piece_lenth + piece_lenth]
        r_kv.set(key, value.to_json())
    

@utils.print_func_name
def test_create_dash():
    test_id = range(1, 10)
    test_meta = {'author': 'author-', 'name': 'name-', 'time_modified': ''}
    test_content = [{"x": 0,"y": 5,"width": 6,"height": 5},
                    {"x": 6,"y": 5,"width": 6,"height": 5},
                    {"x": 0,"y": 0,"width": 6,"height": 5},
                    {"x": 6,"y": 0,"width": 6,"height": 5}]
    for _id in test_id:
        _id = str(_id)
        tmp_time = int(time.time()) - random.randint(1, 100) * random.randint(1, 100)
        meta = {i: test_meta[i] + _id for i in test_meta}
        meta['time_modified'] = tmp_time
        meta['id'] = _id

        content = dict(grid=test_content, name=meta['name'])
        r_db.zadd(config.DASH_ID_KEY, _id, tmp_time)
        r_db.hset(config.DASH_META_KEY, _id, json.dumps(meta))
        r_db.hset(config.DASH_CONTENT_KEY, _id, json.dumps(content))




