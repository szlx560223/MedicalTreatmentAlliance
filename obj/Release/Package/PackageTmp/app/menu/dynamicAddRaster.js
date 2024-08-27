// 动态添加栅格文件
define(["esri/config", "esri/layers/MapImageLayer", "app/dialogs/DynamicAddRasterUI"], 
    function (esriConfig, MapImageLayer, DynamicAddRasterUI) {
    return {
        eventHandle: null,

        invoke: function(view, scene) {
            var me = this;

            var dynamicAddRasterUI = new DynamicAddRasterUI("DynamicAddRasterModal");
            dynamicAddRasterUI.create(view, scene);

            if (me.eventHandle != null) {
                window.removeEventListener("DynamicAddRasterEvent", me.eventHandle);
                me.eventHandle = null;
            }
           
            me.eventHandle = dynamicAddRasterUI.on("dynamicAddRaster", onDynamicAddRaster);
            dynamicAddRasterUI.show();

            // 响应DynamicAddVectorEvent事件
            function onDynamicAddRaster(e) {
                let url = mapServiceManage[0].url;

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
                                    workspaceId: "raster",
                                    type: "raster"
                                }
                            },
                        }
                    ]
                });
                view.map.add(layer);
            }
        }
    }    
});

