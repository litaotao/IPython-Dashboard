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


@utils.print_func_name
def testColorPrint():
    test_strings = [u"oh, my god, that girl is so hot...",
                    u"来吧，宝贝儿",
                   ]
    for text in test_strings:
        for color in utils.color_set:
            utils.print_info(text, color=color)
