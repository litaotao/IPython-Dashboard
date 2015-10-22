# -*- coding: utf-8 -*- 

from dashboard import app, config

app.run(debug=config.app_debug, host=config.app_host, port=config.app_port)
