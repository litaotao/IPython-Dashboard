# -*- coding: utf-8 -*-

import os
import io
from setuptools import find_packages, setup


setup(
    name="IPython-Dashboard",
    version='0.1.2',
    author="Taotao Li",
    author_email="taotao.engineer@gmail.com",
    url="https://github.com/litaotao/IPython-Dashboard",
    keywords = ("ipython", "dashboard", "interactive", "visualization", "data science", "data analysis", "streaming"),
    license="BSD",
    packages=find_packages(),
    package_dir={"dashboard": "dashboard"},
    include_package_data=True,
    description="An stand alone, light-weight web server for building, sharing graphs in created in ipython. Let ipython do what it focus, let this do what everyone needs for building a interactive, collaborated and real-time streaming dashboards.",
    long_description=io.open("README.md", encoding='utf8').read(),
    install_requires=io.open("requirements.txt", encoding='utf8').read(),
    classifiers=['Intended Audience :: Science/Research',
                 'Intended Audience :: Developers',
                 'Programming Language :: Python',
                 'Topic :: Software Development',
                 'Topic :: Scientific/Engineering',
                 'Operating System :: Microsoft :: Windows',
                 'Operating System :: POSIX',
                 'Operating System :: Unix',
                 'Operating System :: MacOS',
                 'Programming Language :: Python :: 2',
                 'Programming Language :: Python :: 2.7',
                 'Programming Language :: Python :: 3',
                 'Programming Language :: Python :: 3.3'],
    zip_safe=False,
    entry_points={
        'console_scripts': [
            'dash-server = dashboard.server.start:run',
        ]
    }
)
