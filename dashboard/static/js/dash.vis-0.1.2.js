

function gen_data(){
    return [
    {
        values: [{x: 1, y:1}, {x: 2, y:2}],
        key: "line 1",
    }
];
}

function gen_test_data(){
  return [
    {
        values: [{x: 2, y: 1}, {x: 1.5, y: 1.5}, {x: 2, y: 2}],
        key: "line 1",
    },
    {
        values: [{x: 1, y:1}, {x: 2, y:2}, {x: 3, y:3}],
        key: "line 2",
    },
  ];
}

function gen_test_data_v2(){
  var data = new d3.range(0,3).map(function(d,i) {
      return {
          key: 'Stream' + i,
          values: new d3.range(0,11).map( function(f,j) {
              return {
                  y: 10 + Math.random()*100 * (Math.floor(Math.random()*100)%2 ? 1 : -1),
                  x: j
              }
          })
      };
  });

  return data;
}

function gen_test_data_bar_v1() {
    return stream_layers(1,128,.1).map(function(data, i) {
        return {
            key: 'Stream' + i,
            area: i === 1,
            values: data
        };
    });
}

function gen_test_data_pie_v1(){
  return [
        {key: "One", y: 5},
        {key: "Two", y: 2},
        {key: "Three", y: 9},
        {key: "Four", y: 7},
        {key: "Five", y: 4},
        {key: "Six", y: 3},
        {key: "Seven", y: 0.5}
    ];
}

function add_graph(div_id, data){
    nv.addGraph(function() {
        chart = nv.models.lineChart()
            .options({
                transitionDuration: 300,
                useInteractiveGuideline: true
            })
            .tooltips(true);

        chart.xAxis
            .axisLabel("label name")
            .tickFormat(d3.format(',.1f'))
            .staggerLabels(true);

        chart.yAxis
            .axisLabel('value name')
            .tickFormat(function(d) {
                if (d == null) {
                    return 'N/A';
                }
                return d3.format(',.2f')(d);
            });

        d3.select(div_id).append('svg')
            .datum(data)
            .call(chart);

        nv.utils.windowResize(chart.update);
        return chart;
    });
}

function build_graph(){
    data = gen_data();
    add_graph("[graph-id='0'] > div .chart-graph", data);
}

function genLineChart(){
  var chart = nv.models.lineWithFocusChart();
  chart.brushExtent([10,70]);
  chart.xAxis.tickFormat(d3.format(',f'));
  chart.x2Axis.tickFormat(d3.format(',f'));
  chart.yAxis.tickFormat(d3.format(',.2f'));
  chart.y2Axis.tickFormat(d3.format(',.2f'));
  chart.useInteractiveGuideline(true);

  return chart;
}

function genPieChart(){
  var chart = nv.models.pieChart()
    .x(function(d) { return d.key })
    .y(function(d) { return d.y })
    .growOnHover(true)
    // .showLegend(false)
    .labelType('value')
    .color(d3.scale.category20().range())
    ;

  return chart;
}

function genAreaChart(){
  var chart = nv.models.stackedAreaChart()
    .useInteractiveGuideline(true)
    .x(function(d) { return d[0] })
    .y(function(d) { return d[1] })
    .controlLabels({stacked: "Stacked"})
    .duration(300);
    ;
  return chart;
}

function genMultiBarChart(){
  var chart = nv.models.multiBarChart()
    .margin({ bottom: 30 })
    // .focusEnable( true )
    // .barColor(d3.scale.category20().range())
    .duration(300)
    .rotateLabels(45)
    .groupSpacing(0.1)
    .stacked(true)
    ;
  return chart;
}

function renderChart(dom_id, chart, data){
  var svg = d3.select(dom_id).datum(data);
  svg.transition().duration(0).call(chart);
}

function getChart(type){
  switch (type){
    case "line": return genLineChart();
    case "bar": return genMultiBarChart();
    case "pie": return genPieChart();
    case "area": return genAreaChart();
  }
}

function validateData(type, data){
  switch (type){
    case "line": return validateLineData(data);
    case "bar": return validateMultiBarData(data);
    case "pie": return validatePieData(data);
    case "area": return validateAreaData(data);
  }
}

function validateLineData(data){
    return data;
}

function validateMultiBarData(data){
  // raw : [{key: , values: [{x: , y: },]}]
  // [{area: true, disabled: true, key: key, values: [{x: , y: }, ]},]
  $.each(data, function(index, obj){
    obj.area = true;
    obj.disabled = false;
  });
  return data;
}

function validatePieData(data){
  var formatData = [];
  $.each(data[0].values, function(index, obj){
    formatData.push({key: obj.x, y: obj.y});
  });
  data = formatData;
  return data;
}

function validateAreaData(data){
  var formatData = [];
  $.each(data, function(index, obj){
    var tmp = {};
    tmp.key = obj.key;
    var tmpValue = [];
    $.each(obj.values, function(index, objValue){
      tmpValue.push([objValue.x, objValue.y]);
    });
    tmp.values = tmpValue;
    formatData.push(tmp);
  });
  data = formatData;
  return data;
}

var debugChart = null;
var debugData = null;
var chartType = null;

function drawChart(type, graph_id){
  selector = graph_id ? strFormat("div.chart-graph[graph_id='{0}']", graph_id) : "#value";
  console.log(strFormat("###Ready to draw chart : {0}", type));
  //
  var current_dash = store.get(store.get("current-dash"));
  // check is table view or chart view
  if (type == 'table') {
    var selectDOM = $("#keys")[0];
    // var key = selectDOM.options[selectDOM.selectedIndex].text;
    var key = current_dash.grid[graph_id].key;
    var data = store.get(key);
    parseTable(data, selector);
    // parseTable(localKeyValue[key], selector);
    xyAxes.x = [];
    xyAxes.y = [];
    return true;
  };

  // check data avilablity
  // use different js lib to do the drawing, nvd3, c3, d3, leafletjs
  // currently, I just use nvd3 to fullfill the basic graph.
  var chart = getChart(type);
  var selectDOM = $("#keys")[0];

  // clear content if exissted for creating new content
  $.each($(selector)[0].children, function(index, obj){$(selector)[0].removeChild(obj)})

  // get data which need draw, axes defined in data-0.1.0.js as xyAxes
  var key = selectDOM.options[selectDOM.selectedIndex].text;
  var xColumn = localKeyValue[key][ xyAxes.x[0] ];
  var data = [];
  $.each(xyAxes.y, function(index, yAxis){
    var tmp = {};
    var yColumn = localKeyValue[key][ xyAxes.y[index] ];
    tmp["key"] = yAxis;
    tmp["values"] = [];
    for (var index in xColumn){
      tmp["values"].push({"x": xColumn[index], "y": yColumn[index]});
    }
    data.push(tmp);
  });

  // validate and transform data before draw it
  data = validateData(type, data);
  d3.select(selector).append('svg')
    .datum(data)
    .call(chart);

  // register a resize event
  nv.utils.windowResize(chart.update);

  // debug data
  debugChart = chart;
  debugData = data;
}
