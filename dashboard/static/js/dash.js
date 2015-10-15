/************************************
Initialzing work
*************************************/

$(document).ready(function() {
  setTimeout(function(){}, 3000);
  initGridstack();
  setTimeout(function(){console.log("hello")}, 3000);
  createGrids();
  getKeys();
  getValue();
  $('.grid-stack').on('resizestop', function(){
    setTimeout(function(){window.dispatchEvent(new Event('resize'));}, 500);
  });
});



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

// initialze 4 grids
function createGrids(){
  grid = $('.grid-stack').data('gridstack');
  box = '<div data-gs-min-height="4" data-gs-min-width="6">   \
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
              <div id="test_graph" class="chart-graph" style="width: 100%; overflow: auto; color: #444;">   \
              </div>        \
            </div>          \
          </div>   \
        </div>';
  // initialized four boxes
  grid.add_widget(box, 0, 0, 6, 5);
  grid.add_widget(box, 6, 0, 6, 5);
  grid.add_widget(box, 0, 1, 6, 5);
  grid.add_widget(box, 6, 1, 6, 5);
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


function parseTable(data){
  function genElement(type){
    var element = document.createElement(type);
    if (type == "td"){
      element.setAttribute("nowrap", "nowrap");
    }
    return element;
  }
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


function saveDash(){
  var res = _.map($('.grid-stack .grid-stack-item:visible'), function (el) {
    el = $(el);
    var node = el.data('_gridstack_node');
    return {
        id: el.attr('data-custom-id'),
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height
    };
  });
  var resJson = JSON.stringify(res);
  var dashName = $("#dashboard_name")[0].value;
  var url = "http://127.0.0.1:9090/dash/";
  $.post();
}




function test(){
  console.log("test");
}
