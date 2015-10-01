function onmouseoverChange(obj)
    {
        obj.style.borderColor="#FF6600";
        obj.style.borderWidth="1px";
        obj.style.backgroundColor="FFFFCC";
    }

function add_box() {
    gridster = $(".gridster > ul").gridster({}).data('gridster');
    next_index = gridster.$widgets.length + 1;
    gridster.add_widget("<li data-row=\"1\" data-col=\"1\" data-sizex=\"1\" data-sizey=\"1\">" + next_index + "</li>");
}