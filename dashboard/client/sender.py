# -*- coding: utf-8 -*-

# built-in package

# third-parth package

# user-defined package
from dashboard import r_kv


def sender(obj, key, value="", meta={}, force=True):
    """Send an object to storage[redis]. key is the obj name,
    value is the serialized object[a dict most of the time]

    Args:
        obj: unserialized-obj need persistent in storage, currently using redis.
             the object maybe [pandas.DataFrame, matplotlib.plt.plot, dict];
        key: option, key to store in storage;
        value: option, value to store in storage;
        meta: option, meta info of the key-value in storage;
        force: option, if true, will over-write the existing key if the key is used.
    """
    suffix = '-meta'
    # persistent key and value
    if (key in r_kv or key + suffix in r_kv) and not force:
        print 'Collision: key: {}, or {} exists in storage'.format(key, key + suffix)
        return None

    value = value if value else obj.to_json()
    res = r_kv.set(key, value)

    if meta:
        res = r_kv.set(key + suffix, meta)

    return res
