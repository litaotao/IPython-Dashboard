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


def test_create_dataframe():
    url = 'https://github.com/litaotao/data-science/raw/master/examples/happy-healthy-hungry/data/SFBusinesses/businesses.csv'
    if 'businesses.csv' in os.listdir('/mnt/tmp'):
        url = '/mnt/tmp/businesses.csv'
    data = pd.read_csv(url)
    piece_lenth = 1000
    for piece in range(len(data) / piece_lenth):
        key = 'businesses-{}'.format(piece)
        value = data[piece * piece_lenth : piece * piece_lenth + piece_lenth]
        r_kv.set(key, value.to_json())

def test_create_dash():
    test_id = range(1, 10)
    test_meta = {'author': 'author-', 'name': 'name-', 'time_modified': '', 'desc': ''}
    test_content = [{"x":0,"y":5,"width":6,"height":5},
                    {"x":6,"y":5,"width":6,"height":5},
                    {"x":0,"y":0,"width":6,"height":5},
                    {"x":6,"y":0,"width":6,"height":5}]
    for i in test_id:
        tmp_time = int(time.time()) - random.randint(1, 100) * random.randint(1, 100)
        tmp_meta = {i: test_meta[i] + str(i) for i in test_meta}
        tmp_meta['time_modified'] = tmp_time
        tmp_meta['id'] = i

        r_db.zadd(config.DASH_ID_KEY, i, tmp_time)
        r_db.hset(config.DASH_META_KEY, i, tmp_meta)
        r_db.hset(config.DASH_CONTENT_KEY, i, test_content)




