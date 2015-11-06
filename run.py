# -*- coding: utf-8 -*-


from dashboard import app, config

app.run(host=config.app_host, port=config.app_port, debug=config.app_debug)
