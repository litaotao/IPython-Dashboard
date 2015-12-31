# -*- coding: utf-8 -*-

# built-in package
import os
import time
import json
import random

# third-party package
import MySQLdb
import pandas as pd

# user-defined package
from .. import r_kv, r_db, config
from dashboard.server import utils
from dashboard.client import sender
from dashboard.server.resources import home


TMP_DIR = '/mnt/tmp'


@utils.print_func_name
def test_clear_redis():
    for key in r_kv.keys():
        r_kv.delete(key)

    for key in r_db.keys():
        r_db.delete(key)


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
def test_create_mysql_data():
    # create database
    def test_create_database():
        conn = MySQLdb.connect(host=config.sql_host, port=config.sql_port,
            user=config.sql_user, passwd=config.sql_pwd)

        conn.cursor().execute('CREATE DATABASE IF NOT EXISTS {};'.format(config.sql_db))
        conn.close()

        return None

    test_create_database()

    # create table
    conn = utils.SQL(host=config.sql_host, port=config.sql_port,
        user=config.sql_user, passwd=config.sql_pwd, db=config.sql_db)
    sql = [
        # drop table first
        '''
        DROP TABLE IF EXISTS businesses;
        ''',
        # create table then
        '''CREATE TABLE businesses (
            business_id     INT,
            name            VARCHAR(64) CHARACTER SET utf8 COLLATE utf8_bin,
            address         VARCHAR(256),
            city            CHAR(64),
            state           CHAR(64),
            postal_code     CHAR(32),
            latitude        FLOAT(32),
            longitude       FLOAT(32),
            phone_number    CHAR(32)
        )''',
    ]
    for query in sql:
        query = query.strip()
        conn.run(query)

    # load data into table
    url = 'https://github.com/litaotao/data-science/raw/master/examples/happy-healthy-hungry/data/SFBusinesses/businesses.csv'
    if os.path.isdir(TMP_DIR) and 'businesses.csv' in os.listdir(TMP_DIR):
        url = TMP_DIR + '/businesses.csv'
    data = pd.read_csv(url)
    data.name = [i.replace('\xc9', '') for i in data.name]
    data.name = [i.replace('\xc8', '') for i in data.name]
    data.name = [i.replace('\xca', '') for i in data.name]

    data.to_sql('businesses', conn.conn, if_exists='append', flavor='mysql', index=False)


@utils.print_func_name
def test_create_dash():
    home_resource = home.Home()
    authors = ['sam', 'aaron', 'bee', 'will', 'ryan', 'mike', 'kevin', 'elvis', 'tiyu', 'sophia']
    name_prefix = 'dashboard name {}'
    for i in range(len(authors)):
        home_resource._create_dash(name_prefix.format(i), authors[i])
