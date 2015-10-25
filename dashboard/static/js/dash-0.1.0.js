/************************************
Dom templates
*************************************/

// add a gridstack box
var box_template = ' \
<div data-gs-min-height="4" data-gs-min-width="6">   \
  <div class="grid-stack-item-content">              \
    <div class="chart-wrapper">                      \
      <div class="chart-title bold">                 \
        <table class="table input-title-level-2">    \
          <tr class="active" style="padding-left: 10%;">   \
            <td style="padding: 0px; width: 90%; padding-left: inherit">   \
              <input class="form-control input-lg input-title-level-2" maxlength="32" placeholder="Naming your graph">  \
            </td>                                                                                                       \
            <td style="padding: 0px; width: 10%">                                                                       \
              <button class="btn btn-primary edit-button" data-toggle="modal" data-target="#myModal">                   \
                <i class="fa fa-fw fa-lg fa-edit" style="color: black;" onclick="addClassMark(this)"></i></button>      \
            </td>   \
          </tr>     \
        </table>    \
      </div>        \
      <div class="chart-graph" style="width: 100%; overflow-x:auto; overflow-y:auto; color: #444;" type_name="none" key_name="none">   \
      </div>        \
    </div>          \
  </div>            \
</div>';

// render the head row of a table
var th_template = ' \
<div class="btn-group"> \
  <button type="button" class="btn btn-xs dropdown-toggle btn-success" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="padding: 0px 0px;">  \
    {0} <span class="caret"></span>  \
  </button>  \
  <ul class="dropdown-menu"> \
    <li style="width: 50px;"><input type="checkbox" onclick="markXy(this, 1)" style="margin-left: 15px;">   x</li> \
    <li style="width: 50px;"><input type="checkbox" onclick="markXy(this, 0)" style="margin-left: 15px;">   y</li> \
  </ul> \
</div>'

// setting dropdown box in home page
var setting_template = '       \
<ul class="nav navbar-nav">    \
  <li class="dropdown">        \
    <a href="#" class="dropdown-toggle" data-toggle="dropdown" style="padding: 2px 2px;"><span class="fa fa-fw fa-lg fa-cog"></span></a>  \
    <ul class="dropdown-menu">  \
      <li><a href="#">share <span class="fa fa-fw fa-sm fa-group"></span></a></li>       \
      <li class="divider" style="margin: auto;"></li>  \
      <li><a href="#">delete <span class="fa fa-fw fa-sm fa-times-circle"></span></a></li>           \
    </ul>  \
  </li>    \
</ul>'


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
    resizable: {handles: "e, se, s, sw, w"}
  };
  $('.grid-stack').gridstack(options);
}


// create gridstack grids according the data from server
function createGrids_v2(){
  var grid = $('.grid-stack').data('gridstack');
  var dash_id = $("meta[name=dash_id]")[0].attributes.value.value;
  var dash_content = getDash(dash_id);
  var tmp = null;
  var graph_with_key = {}
  // initialized boxes using data from server & set key_name and type_name attribute
  $("#dashboard_name")[0].value = dash_content.name;
  $.each(dash_content.grid, function(index, obj){
    tmp = grid.add_widget(box_template, obj.x, obj.y, obj.width, obj.height);  
    tmp[0].setAttribute("graph-id", index);
    $(tmp).find("input.input-title-level-2")[0].value = obj.graph_name;
    $(tmp).find(".chart-graph")[0].setAttribute("key_name", obj.key);
    $(tmp).find(".chart-graph")[0].setAttribute("type_name", obj.type);
    graph_with_key[obj.id] = obj.key;
  })

  // initialized graph data
  $.each(graph_with_key, function(index, key){
    console.log(key);
    if (key == "none"){
        console.log("no key exist");
    }else{
        $.getJSON("http://127.0.0.1:9090/key/" + key, function(data){
            console.log($(strFormat("div [graph-id={0}] .chart-graph", index)));
            parseTable($.parseJSON(data.data), strFormat("div [graph-id={0}] .chart-graph", index));
            console.log($.parseJSON(data.data));
        })
    }
  })
}


// get all the keys from server
function getKeys(){
  $("[data-target]").on("click", function(){
    var keys_select = $("#keys");
    keys_select.empty();

    // console.log("get_keys");
    var url = "http://127.0.0.1:9090/keys";
    $.getJSON(url, function(data){
      $.each(data.data, function(index, value){
        keys_select.append("<option>" + value + "</option>")
      })
    });
  })
}

var localKeyValue = {};
// get the value for a key and parse it as a table by default
function getValue(){
  $("#keys").on("change", function(){
    var selectDOM = $("#keys")[0];
    var key = selectDOM.options[selectDOM.selectedIndex].text;

    var url = "http://127.0.0.1:9090/key/" + key;
      // console.log(url);

    $.getJSON(url, function(data){
        // console.log(data);
        var jsonData = $.parseJSON(data.data)
        localKeyValue[key] = jsonData;
        parseTable(jsonData, "#value");
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


/***************************************
visualzie table
***************************************/
var xyAxes = {"x": [], "y": []};

function markXy(obj, xy){
  var btn_type = xy ? 'btn-info' : 'btn-warning';
  var axesName = obj.parentElement.parentElement.parentElement.children[0].innerText.trim();
  // change hightlight colour
  if (obj.checked){
      var node = obj.parentElement.parentElement.parentElement.children[0];
      node.classList.remove('btn-success');
      node.classList.add(btn_type);
      // push axes info
      xyAxes[xy ? "x" : "y"].push(axesName);
  }else{
      var node = obj.parentElement.parentElement.parentElement.children[0];
      node.classList.remove(btn_type);
      node.classList.add('btn-success');
      // remove axes info
      xyAxes[xy ? "x" : "y"] = $.grep(xyAxes[xy ? "x" : "y"], function(value){return value != axesName});
  }
  console.log(xyAxes);
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

  for (var row = 0; row < 200; row++) {
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

  // remove table
  // $.each($("#value")[0].children, function(index, obj){$("#value")[0].removeChild(obj)}) 
  var tableDOM = $(selector)[0]
  currentTable = tableDOM.children
  for (var i = currentTable.length - 1; i >= 0; i--) {
    tableDOM.removeChild(currentTable[0]);
  };

  // add table
  table.appendChild(thead);
  table.appendChild(tbody);
  tableDOM.appendChild(table);
  // console.log(tableDOM.innerHTML);
}


var graph_obj = null;
function addClassMark(obj){
  graph_obj = obj.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[1]
}


function saveGraph(){
  var data = $("#value")[0].children[0].cloneNode(true);
  graph_obj.innerHTML = "";
  graph_obj.appendChild(data);
  graph_obj.setAttribute("key_name", $("#keys")[0].options[$("#keys")[0].selectedIndex].text);
  a1 = data;
  a2 = graph_obj;
}


function saveDash(){
  // dash name 
  var dashName = $("#dashboard_name")[0].value; // must need
  if (100 < dashName.length || dashName.length < 6) {
    alert("dashboard name note valid, digits should between 6 and 100, thanks.")
    return null;
  }

  var res = _.map($('.grid-stack .grid-stack-item:visible'), function (el) {
    el = $(el);
    var node = el.data('_gridstack_node');
    var key = el.find("div.chart-graph")[0].getAttribute("key_name");
    var type = el.find("div.chart-graph")[0].getAttribute("type_name");
    var name = el.find("input.input-title-level-2")[0].value;
    return {
        id: el.attr("graph-id"),
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height,
        key: (key) ? key : "none",
        type: (type) ? type : "none",
        graph_name: (name) ? name : "hi, give me a name ^_^",
    };
  });

  var dash_id = $("meta[name=dash_id]")[0].attributes.value.value;
  if (dash_id.length < 1){
    var url = "http://127.0.0.1:9090/dash/0";
    var method = "POST";
    var resJson = JSON.stringify({"grid": res, "name": dashName});
  }else{
    var url = "http://127.0.0.1:9090/data/dash/" + dash_id;
    var method = "PUT";
    var resJson = JSON.stringify({"grid": res, "name": dashName});
  }
  
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
    console.log(data);})
  .complete(function(){console.log("ajax complete")})
  .always(function(){console.log("ajax always")});
}


function getDash(dash_id){
  var url = "http://127.0.0.1:9090/data/dash/" + dash_id;
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
    return data;})
  .complete(function(){console.log("ajax complete")})
  .always(function(){console.log("ajax always")});

  return resJson.responseJSON.data;
}


function getDashList(){
  var url = "http://127.0.0.1:9090/data/dashes/";
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
    return data;})
  .complete(function(){console.log("ajax complete")})
  .always(function(){console.log("ajax always")});

  return resJson.responseJSON.data;
}


function initDashList(){
  var list = getDashList();
  var tbody = $("#dash_list")[0];
  var url = "http://127.0.0.1:9090/dash/";

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
    // action.appendChild(i);
    action.innerHTML = setting_template;
    tr.appendChild(name);
    tr.appendChild(author);
    tr.appendChild(time);
    tr.appendChild(action);
    tbody.appendChild(tr);
  });
}


function addBox(){
  var grid = $('.grid-stack').data('gridstack');
  grid.add_widget(box_template, 200, 200, 6, 5, true);
  getKeys();
}


function strFormat(theString){
    // The string containing the format items (e.g. "{0}")
    // will and always has to be the first argument.
    
    // start with the second argument (i = 1)
    for (var i = 1; i < arguments.length; i++) {
        // "gm" = RegEx options for Global search (more than one instance)
        // and for Multiline search
        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        theString = theString.replace(regEx, arguments[i]);
    }
    
    return theString;
}