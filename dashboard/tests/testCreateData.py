# -*- coding: utf-8 -*-

# built-in package
import os
import time
import json
import random

# third-party package
import pandas as pd

# user-defined package
from .. import r_kv, r_db, config
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
        url_2 = TMP_DIR + '/inspections.csv'
    data = pd.read_csv(url_2)
    piece_lenth = 1000
    for piece in range(len(data) / piece_lenth):
        key = 'inspections-{}'.format(piece)
        value = data[piece * piece_lenth : piece * piece_lenth + piece_lenth]
        r_kv.set(key, value.to_json())
    #
    url_3 = 'https://github.com/litaotao/IPython-Dashboard/raw/v-0.1.2-visualiza-table/docs/people_number_by_province_lateset_10_years.csv'
    if os.path.isdir(TMP_DIR) and  'people_number_by_province_lateset_10_years.csv' in os.listdir(TMP_DIR):
        url_3 = TMP_DIR + '/people_number_by_province_lateset_10_years.csv'
    data = pd.read_csv(url_3)
    r_kv.set('chinese_population', data.to_json())


@utils.print_func_name
def test_create_dash():
    test_id = range(1, 10)
    test_author = ['sam', 'aaron', 'bee', 'will', 'ryan', 'mike', 'kevin', 'elvis', 'tiyu', 'sophia']
    test_meta = {'author': 'author-', 'name': 'name-', 'time_modified': ''}
    default_option = {"x": [], "y": []}
    test_content = {"0": {"x": 0, "y": 5, "width": 6, "height": 5, "key": "none", "type": "none", "option": default_option},
                    "1": {"x": 6, "y": 5, "width": 6, "height": 5, "key": "none", "type": "none", "option": default_option},
                    "2": {"x": 0, "y": 0, "width": 6, "height": 5, "key": "none", "type": "none", "option": default_option},
                    "3": {"x": 6, "y": 0, "width": 6, "height": 5, "key": "none", "type": "none", "option": default_option},
                    }
    for _id in test_id:
        tmp_time = int(time.time()) - random.randint(1, 100) * random.randint(1, 100)

        test_meta['time_modified'] = tmp_time
        test_meta['id'] = _id
        test_meta['author'] = test_author[_id]
        test_meta['name'] = 'dashboard_name_' + str(_id)
        for i in test_content:
            test_content[i].update({'graph_name': 'graph name ' + i, 'id': i})
        content = dict(grid=test_content, name=test_meta['name'], id=_id)
        r_db.zadd(config.DASH_ID_KEY, _id, tmp_time)
        r_db.hset(config.DASH_META_KEY, _id, json.dumps(test_meta))
        r_db.hset(config.DASH_CONTENT_KEY, _id, json.dumps(content))
