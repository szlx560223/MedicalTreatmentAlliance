// 实现分级渲染功能
define(["esri/config", "app/dialogs/RouteQueryUI"], 
    function (esriConfig, RouteQueryUI) {
    return {
        invoke: function(view ,scene) {
          let routeQueryUI = new RouteQueryUI("routeQueryUI");
          routeQueryUI.create(view, scene);
          routeQueryUI.show();
        }
    }    
});

