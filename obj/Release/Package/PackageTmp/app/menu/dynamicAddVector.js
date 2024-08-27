// 动态添加矢量文件
define(["esri/config", "esri/layers/MapImageLayer", "app/dialogs/DynamicAddVectorUI"], 
    function (esriConfig, MapImageLayer, DynamicAddVectorUI) {
    return {
        eventHandle: null,

        invoke: function(view, scene) {
            let me = this;

            var dynamicAddVectorUI = new DynamicAddVectorUI("DynamicAddVectorModal");
            dynamicAddVectorUI.create(view, scene);

            if (me.eventHandle != null) {
                window.removeEventListener("DynamicAddVectorEvent", me.eventHandle);
                me.eventHandle = null;
            }
           
            me.eventHandle = dynamicAddVectorUI.on("dynamicAddVector", onDynamicAddVector);
            dynamicAddVectorUI.show();

            // 响应DynamicAddVectorEvent事件
            function onDynamicAddVector(e) {

                let url = mapServiceManage[0].url;

                let renderer = {
                    type: "simple",  // autocasts as new SimpleRenderer()
                    symbol: {
                      type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                      size: 3,
                      color: "red",
                      outline: {  // autocasts as new SimpleLineSymbol()
                        width: 0.5,
                        color: "white"
                      }
                   }
                };

                layer = new MapImageLayer({
                    url: url,
                    opacity: 0.9,
                    sublayers:[
                        {
                            title: e.detail.name,
                            id: 999,
                            source: {
                                type: "data-layer",
                                dataSource: {
                                    dataSourceName: e.detail.name,
                                    workspaceId: "vector",
                                    type: "table"
                                }
                            },
                            renderer: renderer
                        }
                        
                    ]
                });
                view.map.add(layer);
            }
        }
    }    
});

