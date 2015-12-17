

# redis as cache
redis_kv_host = 'localhost'
redis_kv_port = 6379
redis_kv_db   = 0

# redis as db
redis_db_host = 'localhost'
redis_db_port = 6379
redis_db_db   = 1

# web server
app_host  = '127.0.0.1:9090'

# redis key
DASH_ID_KEY = "dash_id"
DASH_META_KEY = "dash_meta"
DASH_CONTENT_KEY = "dash_content"
DASH_DELETED_KEY = "dash_deleted"

# database
sql_type = 'mysql'   # currently just support mysql
sql_host = 'localhost'
sql_port = 3306
sql_user = 'ipd'
sql_pwd  = 'thanks'
sql_db   = 'IPD_data'

# logging
def config_log():
    import logging
    import logging.config
    from ..server.utils import Map
    logging.config.fileConfig('dashboard/conf/logging.conf')
    access_log = logging.getLogger('access')
    error_log = logging.getLogger('error')

    logger = Map()
    logger.access = access_log
    logger.error = error_log

    return logger
logger = config_log()

# env config
# 'dev' will use raw js/css files for debug use
# 'prd' will use min js/css files
# env = 'dev'
