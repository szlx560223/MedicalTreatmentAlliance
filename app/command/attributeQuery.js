// 实现分级渲染功能
define(["esri/config", "app/dialogs/AttributeQueryUI"], 
    function (esriConfig, attributeQuery) {
    return {
        invoke: function(view ,scene) {
          let attributeQueryUI = new AttributeQueryUI("attributeQueryDlg");
          attributeQueryUI.create(view, scene);
          attributeQueryUI.show();
        }
    }    
});

