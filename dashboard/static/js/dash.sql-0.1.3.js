


function runSql(options) {
    console.log("###Run sql options: " + options);
    var sql_raw = (options=="selected" ? editor.getSelectedText() : editor.getValue()) ;
    console.log("###Run sql : " + sql_raw);

}
