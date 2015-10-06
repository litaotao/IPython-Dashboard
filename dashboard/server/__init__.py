# -*- coding: utf-8 -*-

from dashboard import app, config
import views


def run(debug=config.app_debug, host=config.app_host, port=config.app_port):
    app.run(debug=debug, host=host, port=port)





