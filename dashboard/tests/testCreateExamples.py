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
from dashboard.server.resources import dash


TMP_DIR = '/mnt/tmp'
TEST_DATA_FILE = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'test_data.json')
TEST_DASH_DATA = json.load(file(TEST_DATA_FILE, 'r'))


@utils.print_func_name
def test_create_example_1():
    """Create a dashboard contain using chinese population data in the past 15 years"""
    home_resource = home.Home()
    dash_resource = dash.DashData()

    # get and store population data
    url = 'https://github.com/litaotao/IPython-Dashboard/raw/master/docs/people_number_by_province_lateset_10_years.csv'
    if os.path.isdir(TMP_DIR) and  'people_number_by_province_lateset_10_years.csv' in os.listdir(TMP_DIR):
        url = TMP_DIR + '/people_number_by_province_lateset_10_years.csv'
    value = pd.read_csv(url)
    sender(value, 'chinese_population', value.to_json())

    # create sample dashboard
    dash_id, meta, content, = home_resource._create_dash("Dash: Chinese Population", "that man")
    data = TEST_DASH_DATA.get('example_chinese_population')
    dash_resource._update_dash(dash_id, data)
