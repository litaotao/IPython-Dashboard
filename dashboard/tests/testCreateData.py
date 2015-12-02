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
from dashboard.client import sender
from dashboard.server.resources import home


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
        # r_kv.set(key, value.to_json())
        sender(value, key, value.to_json())

    url_2 = 'https://github.com/litaotao/data-science/raw/master/examples/happy-healthy-hungry/data/SFBusinesses/inspections.csv'
    if os.path.isdir(TMP_DIR) and  'inspections.csv' in os.listdir(TMP_DIR):
        url_2 = TMP_DIR + '/inspections.csv'
    data = pd.read_csv(url_2)
    piece_lenth = 1000
    for piece in range(len(data) / piece_lenth):
        key = 'inspections-{}'.format(piece)
        value = data[piece * piece_lenth : piece * piece_lenth + piece_lenth]
        # r_kv.set(key, value.to_json())
        sender(value, key, value.to_json())
    #
    url_3 = 'https://github.com/litaotao/IPython-Dashboard/raw/v-0.1.4-sql-ui-optimize/docs/people_number_by_province_lateset_10_years.csv'
    if os.path.isdir(TMP_DIR) and  'people_number_by_province_lateset_10_years.csv' in os.listdir(TMP_DIR):
        url_3 = TMP_DIR + '/people_number_by_province_lateset_10_years.csv'
    value = pd.read_csv(url_3)
    # r_kv.set('chinese_population', value.to_json())
    sender(value, 'chinese_population', value.to_json())

    url_4 = 'https://github.com/litaotao/IPython-Dashboard/raw/v-0.1.4-sql-ui-optimize/docs/da_zong_jiao_yi_index.csv'
    if os.path.isdir(TMP_DIR) and  'da_zong_jiao_yi_index.csv' in os.listdir(TMP_DIR):
        url_4 = TMP_DIR + '/da_zong_jiao_yi_index.csv'
    value = pd.read_csv(url_4)
    # r_kv.set('chinese_population', value.to_json())
    sender(value, u'大宗交易', value.to_json())


@utils.print_func_name
def test_create_dash():
    home_resource = home.Home()
    authors = ['sam', 'aaron', 'bee', 'will', 'ryan', 'mike', 'kevin', 'elvis', 'tiyu', 'sophia']
    name_prefix = 'dashboard name {}'
    for i in range(len(authors)):
        home_resource._create_dash(name_prefix.format(i), authors[i])
