# -*- coding: utf-8 -*-

# built-in package
import json

# third-party package
import pandas as pd

# user-defined package
from dashboard import r


def test_create_data():
    data = pd.read_csv('https://github.com/litaotao/data-science/raw/master/examples/happy-healthy-hungry/data/SFBusinesses/businesses.csv')
    piece_lenth = 1000
    for piece in range(len(data) / piece_lenth):
        key = 'businesses-{}'.format(piece)
        value = data[piece * piece_lenth : piece * piece_lenth + piece_lenth]
        r.set(key, value.to_json())
    


