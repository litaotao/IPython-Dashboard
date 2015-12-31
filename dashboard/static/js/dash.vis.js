

function genLineChart(timeFormat){
    var chart = nv.models.lineWithFocusChart();
    if (timeFormat == 1) {
        chart.x(function(d){
            return new Date(d.x);
        });
        chart.xScale = d3.time.scale;
        chart.xAxis.tickFormat(function(d) {
            return d3.time.format("%Y-%m-%d")(new Date(d))
        });
    }
    chart.yAxis.tickFormat(d3.format(',.2f'));
    chart.y2Axis.tickFormat(d3.format(',.2f'));
    chart.useInteractiveGuideline(true);
    // chart.brushExtent([-Infinity, Infinity]);

    return chart;
}


function genPieChart(){
    var chart = nv.models.pieChart()
    .x(function(d) { return d.key })
    .y(function(d) { return d.y })
    .growOnHover(true)
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
    .duration(300)
    // .rotateLabels(45)
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
    // pattern:  [{area: true, disabled: true, key: key, values: [{x: , y: }, ]},]
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


function xAxisTimeformat(chart){
    chart.x(function(d){
        return new Date(d.x);
    });
    chart.xScale = d3.time.scale;
    chart.xAxis.tickFormat(function(d) {
        return d3.time.format("%Y-%m-%d")(new Date(d))
    });
}

function drawChartIntoGrid(type, graph_id){
    var selector = strFormat("div.chart-graph[graph_id='{0}']", graph_id);
    console.log(strFormat("###Ready to draw chart : {0}", type));
    var modalData = store.get("modal");
    var key = modalData.key;
    var data = store.get(key);
    //
    if (type == 'table') {
        parseTable(data, selector);
        return true;
    };

    // check data avilablity
    // use different js lib to do the drawing, nvd3, c3, d3, leafletjs
    // currently, I just use nvd3 to fullfill the basic graph.
    // var chart = getChart(type);

    // clear content if exissted for creating new content
    $.each($(selector)[0].children, function(index, obj){$(selector)[0].removeChild(obj)})

    // get data which need draw, axes defined in data-0.1.0.js as xyAxes
    var xColumn = data[ modalData.option.x[0] ];
    var chart = getChart(type);
    if (xColumn[0][4] == '-' && type=='line'){
        console.log('change x-axis time format');
        xAxisTimeformat(chart);
    }
    var graphData = [];
    $.each(modalData.option.y, function(index, obj){
        var tmp = {};
        var yColumn = data[obj];
        tmp["key"] = obj;
        tmp["values"] = [];
        for (var index in xColumn){
            tmp["values"].push({"x": xColumn[index], "y": yColumn[index]});
        }
        graphData.push(tmp);
    });

    // validate and transform data before draw it
    graphData = validateData(type, graphData);
    d3.select(selector).append('svg')
    .datum(graphData)
    .call(chart);

    // register a resize event
    nv.utils.windowResize(chart.update);
}


function initChart(type, graph_id){
    var selector = strFormat("div.chart-graph[graph_id='{0}']", graph_id);
    console.log(strFormat("###Ready to draw chart : {0}", type));
    // var modalData = store.get("modal");
    var current_dash = store.get(store.get("current-dash"));
    var current_graph = current_dash.grid[graph_id];
    var key = current_graph.key;
    var data = store.get(key);
    //
    if (type == 'table') {
        parseTable(data, selector);
        return true;
    };

    // check data avilablity
    // use different js lib to do the drawing, nvd3, c3, d3, leafletjs
    // currently, I just use nvd3 to fullfill the basic graph.
    // var chart = getChart(type);

    // clear content if exissted for creating new content
    $.each($(selector)[0].children, function(index, obj){$(selector)[0].removeChild(obj)})

    // get data which need draw, axes defined in data-0.1.0.js as xyAxes
    var xColumn = data[ current_graph.option.x[0] ];
    var chart = getChart(type);
    if (xColumn[0][4] == '-' && type=='line'){
        console.log('change x-axis time format');
        xAxisTimeformat(chart);
    }
    var graphData = [];
    $.each(current_graph.option.y, function(index, obj){
        var tmp = {};
        var yColumn = data[obj];
        tmp["key"] = obj;
        tmp["values"] = [];
        for (var index in xColumn){
            tmp["values"].push({"x": xColumn[index], "y": yColumn[index]});
        }
        graphData.push(tmp);
    });

    // validate and transform data before draw it
    graphData = validateData(type, graphData);
    d3.select(selector).append('svg')
    .datum(graphData)
    .call(chart);

    // register a resize event
    nv.utils.windowResize(chart.update);
}


function drawChartIntoModal(type){
    var modalData = store.get("modal");
    var key = modalData.key;
    var data = store.get(key);

    // clear content if exissted for creating new content
    $.each($("#value")[0].children, function(index, obj){$("#value")[0].removeChild(obj)})

    if (type == 'table') {
        parseTable(data, "#value");
        return true;
    };

    var xColumn = data[ modalData.option.x[0] ];
    var chart = getChart(type);
    if (xColumn[0][4] == '-' && type=='line'){
        console.log('change x-axis time format');
        xAxisTimeformat(chart);
    }
    var graphData = [];
    $.each(modalData.option.y, function(index, obj){
        var tmp = {};
        var yColumn = data[obj];
        tmp["key"] = obj;
        tmp["values"] = [];
        for (var index in xColumn){
            tmp["values"].push({"x": xColumn[index], "y": yColumn[index]});
        }
        graphData.push(tmp);
    });

    // validate and transform data before draw it
    graphData = validateData(type, graphData);
    d3.select("#value").append('svg')
    .datum(graphData)
    .call(chart);

    // register a resize event
    nv.utils.windowResize(chart.update);

    // update modal setting
    modalData.type = type;
    store.set("modal", modalData);
}
