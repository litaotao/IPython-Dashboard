

function gen_data(){
    return [
    {
        values: [{x: 1, y:1}, {x: 2, y:2}],  
        key: "line 1",
    }
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
    add_graph("#test_graph", data);
}

