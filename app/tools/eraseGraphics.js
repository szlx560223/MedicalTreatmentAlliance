// 实现画点功能
define(["esri/config"], 
    function (esriConfig) {
    return {
        invoke: function(view ,scene) {
            view.graphics.removeAll();
        }
    }    
});

