[![build status](https://api.travis-ci.org/litaotao/IPython-Dashboard.svg?branch=master)](https://travis-ci.org/litaotao/IPython-Dashboard)



# IPython-Dashboard
An stand alone, light-weight web server for building, sharing graphs in created in ipython. Let ipython do what it focus, let this do what everyone needs for building a interactive, collaborated and real-time streaming dashboards.



# Goal 

- support raw html visualization
- support python object visualization
- Editable 
- Real-time fresh when rendering a variable python object
- Can be shared, both public and private [ need password ]
- In the notebook, can share an object to a dashboard [ that's visualise that object in that dashboard ]


# Raw Design

- C/S model 
- Server can interact with IPython kernel directly or indirectly 
- Client get data from server internally or server push data to client
- Client consists of several boxes, each box is an independent front-side object, and is editable and drag to rearrange the place to hold it.


![architecture](docs/architecture.jpg)


# Change Log

- V 0.1
    + Add dashboard client template
    + Template consists of box, each box is an independent front-side object
    + Template hierarchy:
        + box page [add, delete, share one or all]
        + box graph [add, delete, share one or all]
        + rename


# Screenshot * [Demo](https://www.youtube.com/watch?v=KJeMtQhDjDg)

![demo](docs/template-screenshot.jpg)



# Run tests




# To do

- template
    - hover tips

- server
    - docstring
    - unittest
    - travis ci
    - pep 8

- issues
    - nices interact with the server app in the module level
    - front end, databricks style
    - build readdocs page after mvp
    - slogan


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




