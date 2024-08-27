// 定义Command事件相应函数的模块
define(["esri/config", "app/command/listTable", "app/command/uniqueValue", "app/command/classBreak", "app/command/attributeQuery",
    "app/command/routeQuery"], 
    function (esriConfig, listTable, unqiueValue, classBreak, attributeQuery, routeQuery) {
    return {
        handle: function(view, scene) {

            // 响应属性列表命令
            $("#listTable").click(function() {
                listTable.invoke(view, scene);
            });

            $("#unqiueValue").click(function() {
                unqiueValue.invoke(view, scene);
            });

            $("#classBreak").click(function() {
                classBreak.invoke(view, scene);
            });

            $("#attributeQuery").click(function() {
                attributeQuery.invoke(view, scene);
            });

            $("#routeQuery").click(function() {
                routeQuery.invoke(view, scene);
            });
        }
    }    
});

