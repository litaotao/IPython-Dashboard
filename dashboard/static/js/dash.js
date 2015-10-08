
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
      widget_base_dimensions: [box_width, box_height],
      widget_margins: [0, 0],
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
        console.log(url);

        $.getJSON(url, {type: "json"}, function(data){
            console.log(data);
        })
    });
}

$(document).ready(function() {
    getKeys();
    getValue();
});

