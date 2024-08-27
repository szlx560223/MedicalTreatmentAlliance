// 实现框选功能
define(["esri/config", "esri/widgets/Sketch/SketchViewModel", "esri/Graphic",  "esri/rest/query", "esri/rest/support/Query"], 
    function (esriConfig, SketchViewModel, Graphic, query, Query) {
    return {
        invoke: function(view ,scene) {
            if (clickEvent != null) {
                clickEvent.remove();
                clickEvent = null;
            }

            let pointSymbol= {
                type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                style: "circle",
                color: [0, 0, 139],
                size: "1px",    // pixels
                outline: {       // autocasts as new SimpleLineSymbol()
                    color: [ 255, 0, 0 ],
                    width: 1  // points
                }
            };

            // 建立一个线符号
            let lineSymbol = {
                type: "simple-line",     // autocasts as new SimpleLineSymbol()
                color: [207, 246, 252],
                width: "2px",
                style: "solid",               
                width: 3
            };

            // 建立一个面符号
            let fillSymbol = {
                type: "simple-fill",     // autocasts as new SimpleFillSymbol()
                color: [173, 206, 220, 0.4],
                outline: {               // autocasts as new SimpleLineSymbol()
                    color: [207, 246, 252],
                    width: 2
                }                    
            };
      
            let sketchViewModel1 = new SketchViewModel({
                view:view,
                layer: view.graphics,
                polygonSymbol:{
                     type:"simple-fill",
                     color:"rgba(254,254,254,0.8)",
                     style:"solid",
                     outline:{
                          color: [128, 128, 128],
                          width: 2
                     }
                }
            });

             // 响应绘制完成事件，进行要素选择
            sketchViewModel1.on("create", function(e) {
                if (e.state === "complete")
                    rectangleSelectFeature(e);
                });
            sketchViewModel1.create("rectangle");

            // 处理矩形选择要素
            function rectangleSelectFeature(e) {
                view.graphics.removeAll();

                // 找到用户选择的当前图层ID？？？？
                let serviceTitle = mapServiceManage[curMapService]["layer"].title;
                let curLayerId = $("#contentList").find('input[name="' + serviceTitle + '"]:checked').val();                    

                if (typeof(curLayerId) == 'undefined') return;

                let queryUrl = mapServiceManage[curMapService]["url"];
                let serviceType = mapServiceManage[curMapService]["type"];
                if (serviceType == "1") {
                    queryUrl = queryUrl + "/" + curLayerId;
                };

                // create the Query object
                let queryObject = new Query();
                queryObject.where = "1 = 1";
                queryObject.outSpatialReference = view.spatialReference;
                queryObject.returnGeometry = true;
                queryObject.geometry = e.graphic.geometry;
                queryObject.spatialRelationship ="intersects";
                queryObject.outFields = ["*"];
              
                // call the executeQueryJSON() method
                query.executeQueryJSON(queryUrl, queryObject).then(function(results) {
                    for(let i=0; i<results.features.length; i++) {
                        let drawGraphic = new Graphic();
                        drawGraphic.geometry = results.features[i].geometry;
                        if (results.geometryType == "point") 
                            drawGraphic.symbol = pointSymbol;

                        if (results.geometryType == "polyline")
                            drawGraphic.symbol = lineSymbol;

                        if (results.geometryType == "polygon")
                            drawGraphic.symbol = fillSymbol;

                        view.graphics.add(drawGraphic);
                    }
                });
            }
        }
    }    
});

