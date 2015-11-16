
### Lessons Learned from this Side Project


- ***Version control is god***
    + Your code version control
    + Explicitly point out the version of packages/libs used by you; In python, put them into requirements.txt and then can use `pip install -r requirements.txt`; for js, I'm not that familiar with it, so I put the version code as a suffix of the source code;

- ***Add a comma after the last element of your list***
    + Wiser choice `the_list = [1, 2, 3, 4, ]`
    + Exceptions : if you will use that list to build a SQL, then should and must remove the last comma after the last element, otherwise will cause a syntax error.

    ```
    glow=> select count(*) from metrics where os not in ('ios', 'android', ) ;
    ERROR:  syntax error at or near ")"
    LINE 1: ...count(*) from metrics where os not in ('ios', 'android', ) ;
    ```

- ***Doc, doc and doc***
    + start write doc as soon as possible, before release the MVP, doc should be ready.
    + For python, use [google style](https://google-styleguide.googlecode.com/svn/trunk/pyguide.html)

- ***Code re-structure and re-factory***
    + for starting a new project, there will be some functional or solutional test, which is necessary but will messing up the code base, so before each small release and milestone, you should clean up the code, and re-factory it if needed.

- ***Write compatible code***
    + for python, you should know something about the compatibility of Python 2 and Python 3, the tutorial will be much helpful, [python-future](http://python-future.org/compatible_idioms.html)

- ***Demo, demo and demo***
    + A live-demo is the most efficiently way the let people know what you've created.
    + Screenshots works fine in most times.
    + If need code, make it as formatted as possible and simple enough.

- ***Test, test and test***
    + Before mvp, please add some tests, that's necessary in every possible way when people taking a look at what you've done.
    + Unit test can create test data for your app, like what I've done in `dashboard.tests.testCreateData.py`.
    + Unit test can help you build a powerful mind when building tools.
    + Unit test can impress people that you are seriously doing what you are doing.
    + Unit test can make people feel safe before the download the project or use the app.
    + When write unit tests, use [travis-ci](travis-ci.org) for [Continous Integration](https://en.wikipedia.org/wiki/Continuous_integration) is a wise choice.

- ***Define your problems first, as clearly as possible***
    + Define your problems, breakdown them, focusing on the current problems.
    + Split milestone into small tasks, make a small release every week [ depends on your project itself, one small release each week is just my taste]

- ***Try to settle done for open source project***
    + You know, some times the docstring of an amazing open source project can not keep pace with the developing. So, just read the source code if it is really a good project or will be used in your project.  
    + e.g: at the very beginning of this project [IPython-Dashboard](https://github.com/litaotao/IPython-Dashboard), the doc of [nvd3](https://github.com/novus/nvd3) is not that good enough, but [zeppelin](zeppelin-project.org) says they use [nvd3](https://github.com/novus/nvd3) for the visulization, and I believe [nvd3](https://github.com/novus/nvd3) also be used in [databricks](https://databricks.com/), so I find that [nvd3](https://github.com/novus/nvd3) is a promising project and will be used in my [IPython-Dashboard](https://github.com/litaotao/IPython-Dashboard), so I really take some time in the source code of [nvd3](https://github.com/novus/nvd3), thank goodness, the source code is very readable though I'm not a js guy, even more than some code wrote by my colleague in our company.

- ***Imagine the use case of you product in the target users' shoes***
    + Yes, your are building an amazing tool or product, which will change the world. But, before you start push it to people out there, it's very import to think about the use case and situation of your target users, and think twice.

- ***Follow the best code style***
    + Good code style will make it much more maintainable and easy to scale.
    + For python: I recommend [google style](https://google.github.io/styleguide/pyguide.html)
    + For js/css/html, I recommend [fex team of baidu style](https://github.com/fex-team/styleguide)
