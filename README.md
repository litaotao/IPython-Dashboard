
[![build status](https://api.travis-ci.org/litaotao/IPython-Dashboard.svg?branch=master)](https://travis-ci.org/litaotao/IPython-Dashboard) [![Documentation Status](https://readthedocs.org/projects/ipython-dashboard/badge/?version=latest)](http://ipython-dashboard.readthedocs.org/en/latest)   [![coverage](https://coveralls.io/repos/litaotao/IPython-Dashboard/badge.svg?branche=master&service=github)](https://coveralls.io/r/litaotao/IPython-Dashboard)   [![PyPI Version](http://img.shields.io/pypi/v/IPython-Dashboard.svg)](https://pypi.python.org/pypi/IPython-Dashboard)  [![Downloads](https://img.shields.io/pypi/dm/ipython-dashboard.svg)](https://pypi.python.org/pypi/IPython-Dashboard)


## ***Inspired by [IPython](http://ipython.org/), built with love***



# IPython-Dashboard
A stand alone, light-weight web server for building, sharing graphs created in IPython. Build for data science, data analysis guys. Building an interactive visualization, collaborated dashboard, and real-time streaming graph.


# Requirements

- redis 2.6+, [install guide](http://redis.io/topics/quickstart)
- pip install -r requirements.txt

# Goal

- support raw html visualization
- support python object visualization
- Editable
- Real-time fresh when rendering a variable python object
- Can be shared, both public and private [ need password ]
- In the notebook, can share an object to a dashboard [ that's visualize that object in that dashboard ]

# Use Case

- if you do exploring in notebook, but just want to share/send the result/summary to people, leave out the details.
- if you have a private notebook, but also need share something in that notebook with people, extract and put into another new notebook is ugly.
- if you are totally disappointed with the complicated code when drawing a graceful/staic graph using matplotlib/seaborn/mpld3 etc.
- if you want an interactive graph, allow people to zoom in/out, resize, get hover tips, change graph type easily.
- if you want a real-time graph.
- if you want an collaborated graph/dashboard.

![wise-choice](https://raw.githubusercontent.com/litaotao/IPython-Dashboard/master/docs/wise-choice.jpg)


# Screenshot and Demo

[Demo on Youtube](https://youtu.be/LOWBEYDkn90)     
[Demo on Youku](http://v.youku.com/v_show/id_XMTM3MTc5MTAwMA)

![screenshot](https://raw.githubusercontent.com/litaotao/IPython-Dashboard/master/docs/template-screenshot-0.1.3-1.jpg)

![screenshot](https://raw.githubusercontent.com/litaotao/IPython-Dashboard/master/docs/template-screenshot-0.1.2-2-small.jpg)

![screenshot](https://raw.githubusercontent.com/litaotao/IPython-Dashboard/master/docs/template-screenshot-0.1.2-3-small.jpg)




# Usage

***IPython-Dashboard-Tutorial.ipynb***: [On nbviewer](http://nbviewer.ipython.org/github/litaotao/IPython-Dashboard/blob/master/docs/IPython-Dashboard-Tutorial.ipynb) or [On github](https://github.com/litaotao/IPython-Dashboard/blob/master/docs/IPython-Dashboard-Tutorial.ipynb)



# Run tests

just run `sudo nosetests --with-coverage --cover-package=dashboard` under this repo

```
chenshan@mac007:~/Desktop/github/IPython-Dashboard$sudo nosetests --with-coverage --cover-package=dashboard
Password:
...
Name                                    Stmts   Miss  Cover   Missing
---------------------------------------------------------------------
dashboard.py                               11      0   100%
dashboard/client.py                         1      0   100%
dashboard/client/sender.py                 11      3    73%   26-27, 33
dashboard/config.py                        13      0   100%
dashboard/server.py                         1      0   100%
dashboard/server/resources.py               0      0   100%
dashboard/server/resources/dash.py         31     17    45%   36, 55-56, 67-79, 92-99
dashboard/server/resources/home.py         40     12    70%   25, 28-30, 82-90
dashboard/server/resources/status.py        8      1    88%   19
dashboard/server/resources/storage.py      15      7    53%   26-28, 43-47
dashboard/server/utils.py                  31      6    81%   18-22, 29, 43
dashboard/server/views.py                  12      0   100%
---------------------------------------------------------------------
TOTAL                                     174     46    74%
----------------------------------------------------------------------
Ran 3 tests in 1.235s

OK
```


# Change Log

- future
    + import dashboard to ipython notebook, one click [ though I don't think it's necessary]
    + front side, databricks style
    + pep 8, code clean up & restructure
    + hover tips
    + edit modal can be resized
    + Share one graph
    + Share one dashboard
    + Presentation mode
    + footer
    + readthedoc
    + unified message display center
    + SQL Editor
    + login management
    + unified logger and exception report


- ***V 0.1.4 : sql-ui-optimize : [ current develop version ]***

    - Dashboard
        + create some examples
        + hover tips
        + unified message display

    - SQL Editor
        + start try using ace to build an online sql editor, but will develop it in the next stage after this version

- ***V 0.1.3 : basic-curd-docs : [ current stable release ]***

    - Dashboard
        + restructure code for future develop
        + more docs and tutorial
        + basic curd operations
        + gh-pages done
        + publish on readthedoc

- V 0.1.2 : visualiza-table
    - slogan: ***Inspired by IPython, built with love***

    - Dashboard
        + document and doc string
        + usage
        + simple visualize table data

    - SQL Editor
        + research & preparation


- V 0.1.1 : dashboard-server : [ current stable release ]  
    - Dashboard
        - dashboard home page
            + sort by dashboard name / creator / last update time

        - dashboard page
            + add graph in a dashboard
            + re-arrange graph
            + resize graph
            + get table view in a graph

    - SQL Editor


- V 0.1 : dashboard-template
    + Add dashboard client template
    + Template consists of box, each box is an independent front-side object
    + Template hierarchy:
        + box page [add, delete, share one or all]
        + box graph [add, delete, share one or all]
        + rename



# Related Projects & Products

- [mpld3](https://github.com/jakevdp/mpld3)
- [lighting](http://lightning-viz.org/)
- [bokeh](http://bokeh.pydata.org/en/latest/)
- [matplotlib](http://matplotlib.org)
- [zeppelin](https://github.com/apache/incubator-zeppelin)
- [yhat](https://github.com/yhat/rodeo)
- [hue](https://github.com/cloudera/hue)
- [plotly](https://github.com/plotly/dashboards)
- [datadog](https://www.datadoghq.com)
- [databricks](https://databricks.com/)
- [nvd3](http://nvd3.org/)
- [c3js](http://c3js.org/)
- [periscope](http://periscope.io)
- [folium](https://github.com/python-visualization/folium)
- [metabase](http://www.metabase.com/)
- [gridstack](https://github.com/troolee/gridstack.js)
- [gridster](http://gridster.net/)
- [dashboards](https://github.com/jupyter-incubator/dashboards)
- [js, css, html code style](https://github.com/fex-team/styleguide)
