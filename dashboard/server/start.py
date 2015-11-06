# -*- coding: utf-8 -*-

# built-in package
from __future__ import print_function
import multiprocessing

# third-party package
from .. import config, app
# user-defined package

# global variable
APP_PROCESS = None

def run(debug=config.app_debug, host=config.app_host, port=config.app_port):
    """Start flask server app."""
    import ipdb; ipdb.set_trace()

    APP_PROCESS = multiprocessing.Process(target=app.run,
        kwargs=({"debug": debug, "host": host, "port": port}))
    APP_PROCESS.daemon = True
    APP_PROCESS.start()
    config.app_pid = APP_PROCESS.pid
    config.app_process = APP_PROCESS

def kill():
    """Kill the flask server app."""
    APP_PROCESS.terminate()
    if APP_PROCESS.is_alive():
        print("###Kill server app failed, pid is : {}".format(config.app_pid))
    else:
        print("###Kill done.")

def main():
    run()


if __name__ == '__main__':
    main()
