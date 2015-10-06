# -*- coding: utf-8 -*-

# built-in package

# third-parth package

# user-defined package
from dashboard import r


def sender(obj, key, value=""):
    """Send an object to storage[redis]. key is the obj name, 
    value is the serialized object[a dict most of the time]

    Args:
        obj: unserialized-obj need persistent in storage, currently using redis.
             the object maybe [pandas.DataFrame, matplotlib.plt.plot, dict];
        key: option, key to store in storage;
        value: option, value to store in storage;
    """
    # persistent key and value
    value = value if value else obj.to_dict()

    return r.set(key, value)



