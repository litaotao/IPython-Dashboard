


function runSql(options) {
    console.log("###Run sql options: " + options);
    var sql_raw = (options=="selected" ? editor.getSelectedText() : editor.getValue()) ;
    sqlAjax(options, sql_raw);
    console.log("###Run sql : " + sql_raw);

}

function sqlAjax(options, sql_raw){
    var postData = JSON.stringify({"sql_raw": sql_raw, "options": options});
    var url = api_root + "data/sql/";
    var method = "POST";

    $.ajax({
        url: url,
        data: postData,
        method: method,
        contentType: "application/json"
    })
    .done(function(){console.log("ajax done")})
    .fail(function(){console.log("ajax fail")})
    .success(function(data){
        console.log("ajax success");
        console.log(data);
        parseSQL(options, data);
    })
    .complete(function(){console.log("ajax complete")})
    .always(function(){console.log("ajax always")})
    ;
}

function parseSQL(options, data){
    if (options == 'format') {
        editor.setValue(data.data, 1);
    }else{
        parseTable_v2(data.data, "#value");
    }
}

function parseTable_v2(data, selector){
    $.each($(selector)[0].children, function(index, obj){$(selector)[0].removeChild(obj)})

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
