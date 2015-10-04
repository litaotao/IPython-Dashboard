function onmouseoverChange(obj)
    {
        obj.style.borderColor="#FF6600";
        obj.style.borderWidth="1px";
        obj.style.backgroundColor="FFFFCC";
    }

function add_box() {
    gridster = $(".gridster > ul").gridster({}).data('gridster');
    next_index = gridster.$widgets.length + 1;
    var box = "<li id=\"a\" data-row=\"1\" data-col=\"1\" data-sizex=\"1\" data-sizey=\"1\"> \
                <div class=\"chart-wrapper\">  \
                  <div class=\"chart-title bold\"> \
                    <table class=\"table input-title-level-2\"> \
                      <tr class=\"active\" style=\"padding-left: 10%;\"> \
                          <td style=\"padding: 0px; width: 90%; padding-left: inherit\"><input class=\"form-control input-lg input-title-level-2\" maxlength=\"32\" placeholder=\"Naming your graph\"></td>  \
                          <td style=\"padding: 0px; width: 10%\"><button class=\"btn btn-primary edit-button\"><i class=\"fa fa-fw fa-lg fa-edit\" style=\"color: black;\"></i></button></td> \
                      </tr> \
                    </table> \
                  </div>  \
                  <div class=\"chart-graph\">  \
                    <iframe src=\" \" style=\"width: 100%; height: 100%; border: initial;\"></iframe> \
                  </div> \
                </li>"
    gridster.add_widget(box);
}