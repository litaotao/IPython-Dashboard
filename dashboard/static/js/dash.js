/************************************
Dom templates
*************************************/

// gridstack box
var box_template = ' \
<div data-gs-min-height="4" data-gs-min-width="6">   \
  <div class="grid-stack-item-content">              \
    <div class="chart-wrapper">                      \
      <div class="chart-title bold">                 \
        <table class="table input-title-level-2">    \
          <tr class="active" style="padding-left: 10%;">               \
            <td style="padding: 0px; padding-left: 5px;">              \
              <button class="fa fa-fw fa-sm fa-circle-o-notch" onclick=toggleGridMovable(this) style="background: none;background-color: inherit;border: none; padding: 0px 0px">         \
              </button></td>                                           \
            <td style="padding: 0px; width: 90%; padding-left: 5px">   \
              <input class="form-control input-lg input-title-level-2" maxlength="128" placeholder="Naming your graph">  \
            </td>                                                                                                       \
            <td style="padding: 0px; width: 10%">                                                                       \
              <ul class="nav navbar-nav" style="padding-left: 7%;">    \
                <li class="dropdown">                                  \
                  <a href="#" class="dropdown-toggle" data-toggle="dropdown" style="padding: 2px 2px;"><span class="fa fa-fw fa-lg fa-cog" style="color: green"></span></a>  \
                  <ul class="dropdown-menu" style="min-width: 30px;">  \
                    <button class="btn btn-primary edit-button" data-toggle="modal" data-target="#myModal">                   \
                      <i class="fa fa-fw fa-sm fa-edit" style="color: black;" graph-id={0} onclick="editModal(this)"></i>     \
                    </button>                                                                                                 \
                    <button class="btn btn-primary edit-button">                                                              \
                      <i class="fa fa-fw fa-sm fa-group" style="color: black;"></i>                                           \
                    </button>                                                                                                 \
                    <li class="divider" style="margin: auto;"></li>                                                           \
                    <button class="btn btn-primary edit-button" onclick=deleteGraph(this)>                                                             \
                      <i class="fa fa-fw fa-sm fa-times-circle" style="color: black;" ></i>                                   \
                    </button>      \
                  </ul>            \
                </li>              \
              </ul>                \
            </td>                  \
          </tr>                    \
        </table>                   \
      </div>                       \
      <div class="chart-graph" graph-id={0} style="width: 100%; overflow-x:auto; overflow-y:auto; color: #444;" type_name="none" key_name="none">   \
      </div>                       \
    </div>                         \
  </div>                           \
</div>';

// the head row of a table
var th_template = '                  \
<div class="btn-group">              \
  <button type="button" class="btn btn-xs dropdown-toggle btn-success" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="padding: 0px 0px;">  \
    {0} <span class="caret"></span>  \
  </button>                          \
  <ul class="dropdown-menu">         \
    <li style="width: 50px;"><input type="checkbox" onclick="markXy(this, 1)" style="margin-left: 15px;">   x</li> \
    <li style="width: 50px;"><input type="checkbox" onclick="markXy(this, 0)" style="margin-left: 15px;">   y</li> \
  </ul>                              \
</div>'

// setting dropdown box in home page
var setting_template = '       \
<ul class="nav navbar-nav">    \
  <li class="dropdown">        \
    <a href="#" class="dropdown-toggle" data-toggle="dropdown" style="padding: 2px 2px;"><span class="fa fa-fw fa-lg fa-cog" style="color: green"></span></a>  \
    <ul class="dropdown-menu" style="min-width: 20px;">                              \
      <li ><a><span class="fa fa-fw fa-sm fa-group"></span></a></li>        \
      <li class="divider" style="margin: auto;"></li>                                \
      <li onclick=deleteDash({0})><a href="#"><span class="fa fa-fw fa-sm fa-times-circle"></span></a></li> \
    </ul>  \
  </li>    \
</ul>'

function deleteGraph(obj) {
    var grid = $('.grid-stack').data('gridstack');
    var current_dash = store.get(store.get("current-dash"));
    delete current_dash.grid[$(obj).parents(".grid-stack-item")[0].getAttribute("graph-id")];
    store.set(store.get("current-dash"), current_dash);
    grid.remove_widget($(obj).parents(".grid-stack-item")[0]);
    saveDash();
}


function editModal(obj){
    var tmpGraph = {"graph_id": obj.getAttribute("graph-id"), key: "", type: "", option: {"x": [], "y": []}};
    store.set("modal", tmpGraph);
    console.log(store.getAll());
}


function toggleGridMovable(obj){
    // clear any active button if set before
    $.each($("button.fa-circle-o-notch"), function(index, btn_obj){
        if (obj != btn_obj){
            btn_obj.className.includes("down") ? btn_obj.classList.remove("fa-spin") : null;
            btn_obj.className.includes("down") ? btn_obj.classList.remove("down") : null;
            btn_obj.style.color = "";
        }
    });
    // tag a new button
    $(obj).toggleClass("down");
    $('.grid-stack').data('gridstack').movable('.grid-stack-item', obj.className.includes("down"));
    $('.grid-stack').data('gridstack').resizable('.grid-stack-item', obj.className.includes("down"));
    obj.style.color = obj.className.includes("down") ? "green" : "";
    obj.className.includes("down") ? obj.classList.add("fa-spin") : obj.classList.remove("fa-spin");

    console.log("grid stack movable");
}


// re-arrange when mouse hover on the side bar
function resizeContent(direction) {
    var padding = (direction==1) ? "100px" : "0px";
    document.getElementById("main-content").style.paddingLeft = padding;
}


// initialize gridstack configure
function initGridstack(){
    var options = {
        width: 12,
        animate: true,
        vertical_margin: 5,
        resizable: {handles: "e, se, s, sw, w"},
        movable: false,
    };
    $('.grid-stack').gridstack(options);
}


// create gridstack grids according the data from server
function createGrids(){
    // clear local storage
    store.clear();

    var grid = $('.grid-stack').data('gridstack');
    var dash_id = $("meta[name=dash_id]")[0].attributes.value.value;
    var dash_content = getDash(dash_id);
    store.set(strFormat("dash-{0}", dash_id), dash_content);
    store.set("current-dash", strFormat("dash-{0}", dash_id));

    var tmp = null;
    var graph_with_key = {}

    // initialized boxes using data from server & set key_name and type_name attribute
    $("#dashboard_name")[0].value = dash_content.name;
    $.each(dash_content.grid, function(index, obj){
        tmp = grid.add_widget(strFormat(box_template, index), obj.x, obj.y, obj.width, obj.height);
        tmp[0].setAttribute("graph-id", index);
        $(tmp).find("input.input-title-level-2")[0].value = obj.graph_name;
        $(tmp).find(".chart-graph")[0].setAttribute("key_name", obj.key);
        $(tmp).find(".chart-graph")[0].setAttribute("type_name", obj.type);
        $(tmp).find(".chart-graph")[0].setAttribute("graph_id", index);
        graph_with_key[obj.id] = obj.key;
    })

    // initialized graph data
    current_dash = store.get(store.get("current-dash"));
    $.each(graph_with_key, function(index, key){
        if (key == "none"){
            console.log("no key exist");
        }else{
            $.getJSON(api_root + "key/" + key, function(data){
                store.set(key, $.parseJSON(data.data));
                console.log($(strFormat("div [graph-id={0}] .chart-graph", index)));
                initChart(current_dash.grid[index].type, index)
                console.log($.parseJSON(data.data));
            })
            // $.ajax({
            //     url: api_root + "key/" + key,
            //     method: "GET",
            //     dataType: "JSONP",
            //     contentType: "application/json",
            //     async: false,
            // })
            // .success(function(data){
            //     store.set(key, $.parseJSON(data.data));
            //     initChart(current_dash.grid[index].type, index)
            //     console.log($.parseJSON(data.data));
            // })
        }
    })

    // make it unmovable after init
    $('.grid-stack').data('gridstack').movable('.grid-stack-item', false);
    $('.grid-stack').data('gridstack').resizable('.grid-stack-item', false);
}

// get all the keys from server
function registerKeysFunc(){
    $("[data-target]").on("click", function(){
        var keys_select = $("#keys");
        keys_select.empty();

        // var url = "http://127.0.0.1:9090/keys";
        var url = api_root + "keys";
        $.getJSON(url, function(data){
            $.each(data.data, function(index, value){
                keys_select.append("<option>" + value + "</option>")
            })
        });
    })
}

// get the value for a key and parse it as a table by default
function getValue(){
    $("#keys").on("change", function(){
        var selectDOM = $("#keys")[0];
        var key = selectDOM.options[selectDOM.selectedIndex].text;
        var modal = store.get("modal");
        // var url = "http://127.0.0.1:9090/key/" + key;
        var url = api_root + "key/" + key;

        $.getJSON(url, function(data){
            var jsonData = $.parseJSON(data.data);
            store.set(key, jsonData);
            modal.key = key;
            modal.type = "table";      // default graph type
            store.set("modal", modal);
            drawChartIntoModal("table");
        })

        // change the btn-chart, table button default as clicked
        $(".btn-chart")[0].classList.add("active");
    });
}


function genElement(type){
    var element = document.createElement(type);
    if (type == "td"){
        element.setAttribute("nowrap", "nowrap");
    }
    return element;
}


function markXy(obj, xy){
    var btn_type = xy ? 'btn-info' : 'btn-warning';
    var axesName = obj.parentElement.parentElement.parentElement.children[0].innerText.trim();
    var modalData = store.get("modal");
    // change hightlight colour
    if (obj.checked){
        var node = obj.parentElement.parentElement.parentElement.children[0];
        node.classList.remove('btn-success');
        node.classList.add(btn_type);
        // push axes info
        modalData.option[xy ? "x" : "y"].push(axesName);
    }else{
        var node = obj.parentElement.parentElement.parentElement.children[0];
        node.classList.remove(btn_type);
        node.classList.add('btn-success');
        // remove axes info
        modalData.option[xy ? "x" : "y"] = $.grep(modalData.option[xy ? "x" : "y"], function(value){return value != axesName});
    }
    store.set("modal", modalData);
    console.log(store.get("modal"));
}


function parseTable(data, selector){
    var table = genElement("table");
    var thead = genElement("thead");
    var tbody = genElement("tbody");
    var tr = genElement("tr");
    var th = genElement("th");
    var td = genElement("td");

    tr.appendChild(th);

    var columns = [];
    $.each(data, function(key, value){
        var th = genElement("th");
        var tmp = strFormat(th_template, "&nbsp " + key + "&nbsp ");
        th.innerHTML = tmp;
        tr.appendChild(th);
        columns.push(key);
    })
    thead.appendChild(tr);

    var indexes = [];

    $.each(data[columns[0]], function(index, value){
        indexes.push(index);
    })

    for (var row = 0; row < indexes.length; row++) {
        var tr = genElement("tr");
        var th = genElement("th");
        th.innerText = indexes[row];
        tr.appendChild(th);
        $.each(columns, function(no_user, col){
            var td = genElement("td");
            td.innerText = data[col][indexes[row]];
            tr.appendChild(td);
        })
        tbody.appendChild(tr);
    };

    table.setAttribute("id", "table_value");
    table.setAttribute("border", "1px");
    table.className = "table-condensed table-hover";
    table.style.fontSize = "small";
    table.style.fontWeight = "400";

    var tableDOM = $(selector)[0]

    // add table
    table.appendChild(thead);
    table.appendChild(tbody);
    tableDOM.appendChild(table);
}


function saveGraph(){
    var modalData = store.get("modal");
    var current_dash = store.get(store.get("current-dash"));
    drawChartIntoGrid(modalData.type, modalData.graph_id);
    current_dash.grid[modalData.graph_id].key = modalData.key;
    current_dash.grid[modalData.graph_id].type = modalData.type;
    current_dash.grid[modalData.graph_id].option = modalData.option;
    store.set(store.get("current-dash"), current_dash);
}


function saveDash(){
    var dash = store.get(store.get("current-dash"));

    // dash name
    var dashName = $("#dashboard_name")[0].value; // must need
    if (100 < dashName.length || dashName.length < 4) {
        alert("dashboard name note valid, digits should between 4 and 100, thanks.")
        return null;
    }
    dash.name = dashName;

    // dash data
    var res = _.map($('.grid-stack .grid-stack-item:visible'), function (el) {
        el = $(el);
        var node = el.data('_gridstack_node');
        var name = el.find("input.input-title-level-2")[0].value;
        var key = dash.grid[el[0].getAttribute("graph-id")].key;
        var type = dash.grid[el[0].getAttribute("graph-id")].type;
        var option = dash.grid[el[0].getAttribute("graph-id")].option;
        var grid = {
            id: el.attr("graph-id"),
            x: node.x,
            y: node.y,
            option: option,
            width: node.width,
            height: node.height,
            key: (key) ? key : "none",
            type: (type) ? type : "none",
            graph_name: (name) ? name : "hi, give me a name ^_^",
        };
        dash.grid[el[0].getAttribute("graph-id")] = grid;
        return grid;
    });

    store.set(store.get("current-dash"), dash);
    var resJson = JSON.stringify(dash);
    // var url = "http://127.0.0.1:9090/data/dash/" + dash.id;
    var url = api_root + "data/dash/" + dash.id;
    var method = "PUT";

    $.ajax({
        url: url,
        data: resJson,
        method: method,
        contentType: "application/json"
    })
    .done(function(){console.log("ajax done")})
    .fail(function(){console.log("ajax fail")})
    .success(function(data){
        console.log("ajax success");
        console.log(data);
    })
    .complete(function(){console.log("ajax complete")})
    .always(function(){console.log("ajax always")})
    ;
}


function getDash(dash_id){
    // var url = "http://127.0.0.1:9090/data/dash/" + dash_id;
    var url = api_root + "data/dash/" + dash_id;
    var resJson = $.ajax({
        url: url,
        method: "GET",
        contentType: "application/json",
        async: false,
    })
    .done(function(data){console.log("ajax done");})
    .fail(function(){console.log("ajax fail")})
    .success(function(data){
        console.log("ajax success");
        console.log(data);
        return data;
    })
    .complete(function(){console.log("ajax complete")})
    .always(function(){console.log("ajax always")});

    return resJson.responseJSON.data;
}


function getDashList(){
    // var url = "http://127.0.0.1:9090/data/dashes/";
    var url = api_root + "data/dashes/";
    var resJson = $.ajax({
        url: url,
        method: "GET",
        contentType: "application/json",
        async: false,
    })
    .done(function(data){console.log("ajax done");})
    .fail(function(){console.log("ajax fail")})
    .success(function(data){
        console.log("ajax success");
        console.log(data);
        return data;
    })
    .complete(function(){console.log("ajax complete")})
    .always(function(){console.log("ajax always")});

    return resJson.responseJSON.data;
}


function initDashList(){
    var list = getDashList();
    var tbody = $("#dash_list")[0];
    // var url = "http://127.0.0.1:9090/dash/";
    var url = api_root + "dash/";

    $.each(list, function(index, obj){
        var a = genElement("a");
        var i = genElement("i");
        var tr = genElement("tr");
        var name = genElement("td");
        var author = genElement("td");
        var time = genElement("td");
        var action = genElement("td");
        a.innerText = obj.name;
        a.setAttribute("href", url + obj.id);
        name.appendChild(a);
        name.setAttribute("data-field", "name");
        author.innerText = obj.author;
        time.innerText = moment(parseInt(obj.time_modified) * 1000).format("YYYY-MM-DD HH:mm:ss");
        i.className = "fa fa-fw fa-lg fa-cog";
        action.innerHTML = strFormat(setting_template, obj.id);
        tr.appendChild(name);
        tr.appendChild(author);
        tr.appendChild(time);
        tr.appendChild(action);
        tbody.appendChild(tr);
    });

    $("#submit").on("click", function submit() {
        var newDash = {
            "name": $("#name")[0].value,
            "author": $("#author")[0].value,
        };
        console.log(api_root);
        $.ajax({
            // I don't know why set url to api_root will cause an error here,
            // need to take little time on diving into this. but it as the doc says:
            // the default value of url is current page, so it works when leave out
            // the url paramter, will take back to this later.
            // url: api_root,
            // url: "http://127.0.0.1:9090/",
            method: "POST",
            dataType: "JSONP",
            data: JSON.stringify(newDash),
            contentType: "application/json",
            async: false,
        })
        .done(function(data){
            console.log("ajax done");
        })
        .fail(function(){
            console.log("ajax fail");
        })
        .success(function(data){
            console.log("ajax success");
            console.log(data);
            return data;
        })
        .complete(function(){
            console.log("ajax complete");
        })
        .always(function(){
            console.log("ajax always");
        });
    });
}


function deleteDash(dash_id) {
    $.ajax({
        url: api_root + "data/dash/" + dash_id,
        // url: strFormat("http://127.0.0.1:9090/data/dash/{0}", dash_id),
        method: "DELETE",
        contentType: "application/json",
        // async: false,
    })
    .done(function(data){console.log("ajax done");})
    .fail(function(){console.log("ajax fail")})
    .success(function(){
        location.reload();
    })
    .complete(function(){console.log("ajax complete")})
    .always(function(){console.log("ajax always")});
}

/*
{
graph_name: "graph name 2",
height: 5,
id: "2",
key: "none",
option: {},
type: "none",
width: 6,
x: 6,
y: 0
}
*/
function addBox(){

    var grid = $('.grid-stack').data('gridstack');
    var new_box = grid.add_widget(box_template, 200, 200, 6, 5, true);
    registerKeysFunc();

    var current_dash = store.get(store.get("current-dash"));
    var new_graph_id = Object.keys(current_dash.grid).length;
    var new_graph_name = strFormat("graph name {0}", new_graph_id);
    new_box[0].setAttribute("graph-id", new_graph_id);
    new_box.find("input.input-title-level-2")[0].value = new_graph_name;
    var new_graph_data = {
        "id": new_graph_id, "key": "none", "type": "none", "option": {"x": [], "y": []},
        "x": new_box[0].getAttribute("data-gs-x"), "y": new_box[0].getAttribute("data-gs-y"),
        "width": new_box[0].getAttribute("data-gs-width"), "height": new_box[0].getAttribute("data-gs-height"),
        "graph_name": new_graph_name
    };
    current_dash.grid[new_graph_id] = new_graph_data;
    store.set(store.get("current-dash"), current_dash);
    console.log("add a new grid box : ", new_graph_data);
}


function strFormat(theString){
    // The string containing the format items (e.g. "{0}")

    for (var i = 1; i < arguments.length; i++) {
        // "gm" = RegEx options for Global search (more than one instance)
        // and for Multiline search
        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        theString = theString.replace(regEx, arguments[i]);
    }
    return theString;
}


function my_alert(msg, error){
    var background_color = error ? 'orangered' : 'cadetblue';
	scrollBy(0, -1000);
    $("#error")[0].style.backgroundColor = background_color;
    $("#error_msg")[0].innerText = msg;
	$("#error").fadeIn(3000);
	$("#error").fadeOut(3000);
}
