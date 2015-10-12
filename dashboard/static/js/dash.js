
function onmouseoverChange(obj)
    {
        obj.style.borderColor="#FF6600";
        obj.style.borderWidth="1px";
        obj.style.backgroundColor="FFFFCC";
    }

function add_box() {
    gridster = $(".gridster > ul").gridster({}).data('gridster');
    next_index = gridster.$widgets.length + 1;
    var box = "<li data-row=\"1\" data-col=\"1\" data-sizex=\"1\" data-sizey=\"1\" class=\"box-li\">  \
              <div class=\"chart-wrapper\"> \
                <div class=\"chart-title bold\"> \
                  <table class=\"table input-title-level-2\"> \
                    <tr class=\"active\" style=\"padding-left: 10%;\"> \
                      <td style=\"padding: 0px; width: 90%; padding-left: inherit\"><input class=\"form-control input-lg input-title-level-2\" maxlength=\"32\" placeholder=\"Naming your graph\"></td> \
                      <td style=\"padding: 0px; width: 10%\"><button class=\"btn btn-primary edit-button\" data-toggle=\"modal\" data-target=\"#myModal\"><i class=\"fa fa-fw fa-lg fa-edit\" style=\"color: black;\"></i></button></td> \
                    </tr> \
                  </table>  \
                </div> \
                <div class=\"chart-graph\"> \
                  <iframe src=\" \" style=\"width: 100%; height: 100%; border: initial;\"></iframe> \
                </div> \
              </div> \
            </li>"
    gridster.add_widget(box);
}


function init_grid(){   //DOM Ready
    var gridster;
    var box_width = Math.floor(document.getElementById("box-ul").offsetWidth / 2)
    var box_height = Math.floor(box_width * 9 / 16)
    
    gridster = $(".gridster ul").gridster({
      widget_base_dimensions: [box_width - 5, box_height - 5],
      widget_margins: [10, 10],
    }).data('gridster');
}


function resize_content(direction) {
    var padding = (direction==1) ? "100px" : "0px";
    document.getElementById("main-content").style.paddingLeft = padding;
}



/*
Interact with server
*/

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


function getValue(){
    // var selectDOM = $("#keys")[0];
    // var key = selectDOM.options[selectDOM.selectedIndex].text;
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



$(document).ready(function() {
    getKeys();
    getValue();
});


function addClassMark(obj){
    obj.classList.add("edit-graph");
}


function saveGraph(){
    // var data = $("#value")[0].cloneNode(true);
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

