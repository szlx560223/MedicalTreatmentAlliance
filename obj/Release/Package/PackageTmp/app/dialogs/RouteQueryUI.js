// 定义RouteQuery对象，并放在模块中，动态生成一个RouteQyery的网页对话框(dialog).
define(["dojo/_base/declare", "esri/config", "esri/rest/query", "esri/rest/support/Query", "esri/layers/FeatureLayer",  
    "esri/widgets/Legend",  "esri/rest/route", "esri/rest/support/RouteParameters", "esri/core/Collection",  "esri/rest/support/Stop"], 
        function(declare, esriConfig, query, Query, FeatureLayer, Legend, route, RouteParameters, Collection, Stop) {
    return declare("RouteQueryUI", null,  {
        constructor : function(id) {
            this._id = id;
            this._viewModel = null;
            this._map = null;
            this._view = null;
            this._scene = null;
        },

        getID: function() {
            return this._id;
        },

        getViewModel: function() {
            return this._viewModel;
        },

        show: function() {

            var me = this;
            me._map.basemap = "arcgis-streets";

            let layer = null;
            // 判断resi_4m图层是否已加载
            for(let i=0; i<me._map.layers.length; i++) {
                if (me._map.layers.items[i].title === "China - Res1 4m") {
                    layer = me._map.layers[i];
                    break;
                }
            }

            // 如果resi_4m图层没有加载，则加载china地图的resi_4m图层
            const serviceUrl = "https://localhost:6443/arcgis/rest/services/map/china/FeatureServer/0";
            if (layer === null) {
                 layer = new FeatureLayer({
                    url: serviceUrl
                });

                me._map.add(layer);
            
                me._view.when().then(() => {
                    // 添加当前打开地图服务的图例
                    var legend = new Legend({
                        view: me._view,
                        layerInfos: [
                        {
                            layer: layer,
                            title: layer.title
                        }],
                        container: legendList    
                    });

                    layer.when(function() {
                        me._view.goTo(layer.fullExtent); 
                        me._viewModel.show(); 
                        fillValue();
                    });
                });
            }
            else {
                me._viewModel.show(); 
                fillValue();
            }

            
            // 根据当前选中的字段Field, 填充字段的值
            function fillValue() {
 
                let queryUrl = serviceUrl;
 
                let queryObject = new Query();
                queryObject.where = "1 = 1";
                queryObject.outSpatialReference = me._view.spatialReference;
                queryObject.returnGeometry = false;
                queryObject.outFields = ["adcode93", "name"];

                // call the executeQueryJSON() method
                query.executeQueryJSON(queryUrl, queryObject).then(function(results) {
                    for(let i=0; i<results.features.length; i++) {
                        let featureAttributes = results.features[i].attributes;
                        let optionText = featureAttributes["adcode93"].toString() + "  " + featureAttributes["name"].toString();
                        let optionValue = featureAttributes["adcode93"].toString();
                        $("#startPosition").append(new Option(optionText, optionValue));
                        $("#middlePosition").append(new Option(optionText, optionValue));
                        $("#endPosition").append(new Option(optionText, optionValue));
                    }
                });
            }
        },

        hide: function() {
            this._viewModel.hide();
        },

        remove: function() {
            this._viewModel.dispose();
            $("#" + this._id).remove();
        },


        create: function(view, scene) {
            var me = this;

            createUI(me._id);
            this._viewModel = bootstrap.Modal.getOrCreateInstance(document.getElementById(this._id));

            // 为“装载”按钮添加click事件
            this._view = view;
            this._scene = scene;
            this._map = view.map;


            $("#executeQuery").click(executeQuery);
            $("#exitQuery").click(function() {
                me.hide();
                me.remove();
            });

            return this._viewModel;

            // 利用jQuery动态创建dom元素，完成modal对话框UI
            function createUI(id) {
                var body = $('body');
                var div = $('<div class="modal" ' + 'id="' + id + '"' + 'data-bs-backdrop="static" data-bs-keyboard="false"></div>');

                var div1 = $('<div class="modal-dialog modal-sm modal-dialog-centered attribute-query">\
                    <div class="modal-content">\
                        <div class="modal-header">\
                            <h5 class="modal-title">路径查询分析</h6>\
                        </div>\
                        <div class="modal-body">\
                            <div class="container">\
                                <div class="row">\
                                    <div class="col-sm-4 p-2 mb-2">\
                                        <div class="mb-1 mt-1 p-0">\
                                            <label for="startPosition" class="form-label">选择起点:</label>\
                                            <select class="form-select combobox" aria-label="" id="startPosition">\
                                            </select>\
                                        </div>\
                                    </div>\
                                    <div class="col-sm-4 p-2 mb-2">\
                                        <div class="mb-1 mt-1 p-0">\
                                            <label for="endPosition" class="form-label">选择中间点:</label>\
                                            <select class="form-select combobox" aria-label="" id="middlePosition">\
                                            </select>\
                                        </div>\
                                    </div>\
                                    <div class="col-sm-4 p-2 mb-2">\
                                        <div class="mb-1 mt-1 p-0">\
                                            <label for="endPosition" class="form-label">选择终点:</label>\
                                            <select class="form-select combobox" aria-label="" id="endPosition">\
                                            </select>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="row">\
                                    <div>\
                                        <button type="button" class="btn btn-primary mt-3" id="executeQuery">查询</button>\
                                        <button type="button" class="btn btn-primary mt-3" id="exitQuery">退出</button>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                </div>');

                div.append(div1);
                body.append(div);
    
            }

            // 路径查询分析
            function executeQuery() {
                let startPosition = $("#startPosition option:selected").val();
                let middlePosition = $("#middlePosition option:selected").val();
                let endPosition = $("#endPosition option:selected").val();

                let queryUrl = "https://localhost:6443/arcgis/rest/services/map/china/FeatureServer/0";
                let queryObject = new Query();

                queryObject.where = `adcode93=${startPosition} OR adcode93=${middlePosition} OR adcode93=${endPosition}`;

                queryObject.outSpatialReference = me._view.spatialReference;
                queryObject.returnGeometry = true;
                queryObject.outFields = ["*"];

                const routeSymbol = {
                    type: "simple-line", // autocasts as SimpleLineSymbol()
                    color: [90, 80, 240, 0.5],
                    width: 4
                };

                // call the executeQueryJSON() method
                query.executeQueryJSON(queryUrl, queryObject).then(function(results) {
                     me._view.graphics.removeAll();

                    let startPoint = results.features[0].geometry;
                    let middlePoint = results.features[1].geometry;
                    let endPoint = results.features[2].geometry;

                    const stops = new Collection([
                        new Stop({
                            geometry: startPoint,
                         }),
                        new Stop({
                            geometry: middlePoint,
                        }),                        
                        new Stop({
                            geometry: endPoint,
                        })
                    ]);

                    const routeParams = new RouteParameters({
                        // An authorization string used to access the routing service
                        apiKey: "AAPKd754b17e153a4dc389b0a20694b092ccQJpx9qtdKXhF7p-blXJ62WuUJWUKilClKW6fsE6LvWYmD0ryEMzJh0om-R9mwaap",
                        stops
                    });	
                
                    // 提供route分析服务的url地址
                    const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";
                    route.solve(routeUrl, routeParams).then(
                        (data) => {
                            const routeResult = data.routeResults[0].route;
                            routeResult.symbol = routeSymbol;
                            view.graphics.add(routeResult);
                        },
                        () => { alert("路径查询分析失败，输入的位置重复或路径无法到达！") }
                    );
                });

                me.hide();
                me.remove();
            }
        }
    });
});
