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

var box_template = '                                 \
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
                  <i class="fa fa-fw fa-lg fa-edit" style="color: black;" onclick="addClassMark_v2(this)"></i></button>      \
              </td>   \
            </tr>     \
          </table>    \
        </div>        \
        <div id="test_graph" class="chart-graph" style="width: 100%; overflow-x:auto; overflow-y:auto; color: #444;">   \
        </div>        \
      </div>          \
    </div>            \
  </div>';

// initialze 4 grids
function createGrids(){
  grid = $('.grid-stack').data('gridstack');
  // initialized four boxes
  grid.add_widget(box_template, 0, 0, 6, 5);
  grid.add_widget(box_template, 6, 0, 6, 5);
  grid.add_widget(box_template, 0, 1, 6, 5);
  grid.add_widget(box_template, 6, 1, 6, 5);
}


function createGrids_v2(){
  grid = $('.grid-stack').data('gridstack');
  // 
  var dash_id = $("meta[name=dash_id]")[0].attributes.value.value;
  var dash_content = getDash(dash_id);
  // initialized boxes using data from server
  $.each(dash_content.grid, function(index, obj){
    grid.add_widget(box_template, obj.x, obj.y, obj.width, obj.height);  
  })
}


/************************************
Interact with server
*************************************/
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

// get the value for a key and parse it as a table by default
function getValue(){
  $("#keys").on("change", function(){
    var selectDOM = $("#keys")[0];
    var key = selectDOM.options[selectDOM.selectedIndex].text;

    var url = "http://127.0.0.1:9090/key/" + key;
      // console.log(url);

    $.getJSON(url, function(data){
        // console.log(data);
        parseTable($.parseJSON(data.data));
    })
  });
}


function genElement(type){
  var element = document.createElement(type);
  if (type == "td"){
    element.setAttribute("nowrap", "nowrap");
  }
  return element;
}


var th_template = ' \
<div class="btn-group"> \
  <button type="button" class="btn btn-xs dropdown-toggle btn-success" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="padding: 0px 0px;">  \
    button name <span class="caret"></span>  \
  </button>  \
  <ul class="dropdown-menu"> \
    <li style="width: 50px;"><input type="checkbox" value="" style="margin-left: 15px;">   x</li> \
    <li style="width: 50px;"><input type="checkbox" value="" style="margin-left: 15px;">   y</li> \
  </ul> \
</div>'

function parseTable(data){
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
    th.innerText = key;
    tr.appendChild(th);
    columns.push(key);        
  })
  thead.appendChild(tr);

  var indexes = [];

  $.each(data[columns[0]], function(index, value){
    indexes.push(index);
  })

  for (var row = 0; row < 20; row++) {
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
  var tableDOM = $("#value")[0]
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


function addClassMark(obj){
  obj.classList.add("edit-graph");
}


function saveGraph(){
  var data = $("#value")[0].children[0].cloneNode(true);
  data.removeAttribute("id");
  data.style.height = "100%";
  data.style.width = "100%";
  var obj = $("td > button > i.edit-graph")[0];
  var res = obj.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[1]
  res.innerHTML = "";
  res.appendChild(data);
  a1 = data;
  a2 = res;
}


var graph_obj = null;
function addClassMark_v2(obj){
  graph_obj = obj.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[1]
}


function saveGraph_v2(){
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
  if (100 < dashName.length || dashName.length < 0) {
    alert("dashboard name note valid, digits should between 6 and 100, thanks.")
    return null;
  }

  var res = _.map($('.grid-stack .grid-stack-item:visible'), function (el) {
    el = $(el);
    var node = el.data('_gridstack_node');
    var key = el.find("div.chart-graph")[0].getAttribute("key_name");
    var type = el.find("div.chart-graph")[0].getAttribute("type_name");
    return {
        id: el.attr('data-custom-id'),
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height,
        key: (key) ? key : "none",
        type: (type) ? type : "none",
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
      action.appendChild(i);
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
}


function test(){
  console.log("test");
}
