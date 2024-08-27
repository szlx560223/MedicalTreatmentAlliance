// 定义LoadMapService对象，并放在模块中，动态生成一个LoadMapService的网页对话框(dialog).
define(["dojo/_base/declare", "esri/config", "esri/geometry/Extent", "esri/layers/MapImageLayer", "esri/layers/TileLayer", 
            "esri/layers/FeatureLayer" ], 
        function(declare, esriConfig, Extent, MapImageLayer, TileLayer, FeatureLayer) {
    return declare("LoadMapService", null,  {
        constructor : function(id) {
            this._id = id;
            this._viewModel = null;
            this._map = null;
            this._view = null;
            this._scene = null
        },

        getID: function() {
            return this._id;
        },

        getViewModel: function() {
            return this._viewModel;
        },

        // 设置初始的地图服务的url地址
        setUrl: function(url) {
            $("#serviceUrl").val(url);
        },

        show: function() {
            this._viewModel.show();        
        },

        hide: function() {
            this._viewModel.hide();
        },

        remove: function() {
            this._viewModel.dispose();
            $("#" + this._id).remove();
        },

        // 通过on方法，把事件响应的函数由外面传递进来
        on: function(name, fn) {
            if (name == "loadMapService") {
                //let button = document.querySelector("#loadService");
                window.addEventListener("LoadMapServiceEvent", fn);
            }
            return fn;
        },

        create: function(view, scene) {
            var me = this;

            createUI(me._id);
            this._viewModel = bootstrap.Modal.getOrCreateInstance(document.getElementById(this._id));

            // 为“装载”按钮添加click事件
            this._view = view;
            this._scene = scene;
            this._map = view.map;


            $("#loadService").click(loadMapService);

            // 当模式对话框隐藏时释放模式框对象及对应的DOM元素
            $("#" + this._id).on("hidden.bs.modal", function() {
                window.removeEventListener("LoadMapServiceEvent", null);
                me._viewModel.dispose();
                $("#" + me._id).remove();
            });

            return this._viewModel;

            // 利用jQuery动态创建dom元素，完成modal对话框UI
            function createUI(id) {
                var body = $('body');
                var div = $('<div class="modal" ' + 'id="' + id + '"' + '></div>');
    
                var div1 = $(
                    '<div class="modal-dialog modal-dialog-centered modal-lg">\
                        <div class="modal-content">\
                            <div class="modal-header">\
                                <h5 class="modal-title">装载地图服务</h5>\
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>\
                            </div>\
                            <div class="modal-body">\
                                <form>\
                                    <div class="mb-2 mt-2">\
                                        <label for="可选服务" class="form-label">已有服务:</label>\
                                        <select class="form-select" aria-label="" id="serviceOptional">\
                                            <option selected value="0">选择一个已有的服务</option>\
                                            <option value="1">https://sampleserver6.arcgisonline.com/arcgis/rest/services/MtBaldy_BaseMap/MapServer</option>\
                                            <option value="1">http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer</option>\
                                            <option value="2">https://server.arcgisonline.com/arcgis/rest/services/Reference/World_Transportation/MapServer</option>\
                                            <option value="6">https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0</option>\
                                            <option value="1">http://222.200.176.37/arcgis/rest/services/map/china/MapServer</option>\
                                            <option value="6">http://222.200.176.37/arcgis/rest/services/map/china/FeatureServer/12</option>\
                                            <option value="1">https://localhost:6443/arcgis/rest/services/map/china/MapServer</option>\
                                            <option value="6">https://localhost:6443/arcgis/rest/services/map/china/FeatureServer/13</option>\
                                        </select>\
                                    </div>\
                                    <div class="mb-2 mt-2">\
                                        <label class="form-label">地图服务URL:</label>\
                                        <input type="text" class="form-control" id="serviceUrl" placeholder="URL">\
                                    <div>\
                                    <div class="mb-2 mt-2">\
                                        <label for="服务类型" class="form-label">服务类型:</label>\
                                        <select class="form-select" aria-label="" id="serviceSelect">\
                                            <option value="0" selected>选择地图服务类型</option>\
                                            <option value="1">MapImageLayer</option>\
                                            <option value="2">TileLayer</option>\
                                            <option value="3">VectorTileLayer</option>\
                                            <option value="4">ImageryLayer<</option>\
                                            <option value="5">ImageryTileLayer</option>\
                                            <option value="6">FeatureLayer</option>\
                                            <option value="7">KMLLayer</option>\
                                            <option value="8">WMSLayer</option>\
                                            <option value="9">WFSLayer</option>\
                                            <option value="10">OpenStreetMapLayer</option>\
                                            <option value="11">SceneLayer</option>\
                                        </select>\
                                    </div>\
                                    <button type="button" class="btn btn-primary mb-2" id="loadService">装载</button>\
                                </form>\
                            </div>\
                                <div class="modal-footer">\
                                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">关闭</button>\
                                </div>\
                        </div>\
                    </div>');
       
                div.append(div1);
                body.append(div);
            }

            // 装载地图服务
            function loadMapService() {
                let serviceType = "";
                let serviceUrl = "";

                let serviceOption = $("#serviceOptional option:selected").val();
                if (serviceOption != '0') {                          // 如果选择了一个已有服务
                    serviceType = serviceOption;
                    serviceUrl = $("#serviceOptional option:selected").text();
                }
                else  {                                             // 如果没有选择服务，则取用户输入的服务
                    serviceType = $("#serviceSelect option:selected").val();
                    serviceUrl = $("#serviceUrl").val();
                }

                // 添加一个自定义装载地图服务事件LoadMapServiceEvent
                let layer = null;
                let event = null;    

                switch(serviceType) {
                    case "0":
                        break;

                    case "1":

/*                        let renderer = {
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
*/
                        layer = new MapImageLayer({
                            url: serviceUrl,
                            opacity: 0.9,
        /*                    sublayers:[
                                {
                                    title: 'wind',
                                    id: 999,
                                    source: {
                                        type: "data-layer",
                                        dataSource: {
                                            dataSourceName: "wind.shp",
//                                            dataSourceName: "bd05_1km.tif",
                                            workspaceId: "vector",
                                            type: "table"
                                        }
                                    },
                                    renderer: renderer
                                }
                                
                            ]*/
                        });
                        me._map.add(layer);
                        break;

                    case "2":
                        layer = new TileLayer({
                            url: serviceUrl,
                            opacity: 0.5
                        });
                        me._map.add(layer);
                        break;

                    case "6":
                        layer = new FeatureLayer({
                            url: serviceUrl
                        });
                        me._map.add(layer);

                        break;
                }                
                me._viewModel.hide();

                // Modify for mapServiceManage. 
                // store all opened map service in mapServiceManage.
                let mapService = {};
                mapService["type"] = serviceType;
                mapService["url"] = serviceUrl;
                mapService["layer"] = layer;
                mapServiceManage.push(mapService);
                curMapService = mapServiceManage.length - 1;

                event = new CustomEvent("LoadMapServiceEvent", {bubbles: true, detail: {name: serviceUrl, layer: layer }});
                window.dispatchEvent(event);
            }
        }
    });
});
