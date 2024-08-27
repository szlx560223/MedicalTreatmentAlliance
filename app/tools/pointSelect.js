// 实现点选功能
define(["esri/config", "esri/Graphic",  "esri/rest/query", "esri/rest/support/Query"], 
    function (esriConfig, Graphic, query, Query) {
    return {
        invoke: function(view ,scene) {
            if (clickEvent != null) {
                clickEvent.remove();
                clickEvent = null;
            }

            const pointGraphic = new Graphic({
                symbol: {
                    type: "simple-marker", 
                    color: [255, 0, 0],
                    size: 6,
                    outline: {
                        color: [255,255,0],
                        width: 1
                    }
                }
            });

            // 建立一个面图形
            const polygonGraphic = new Graphic({
                symbol: {
                  type: "simple-fill", // autocasts as new SimpleFillSymbol()
                  color: [173, 206, 220, 0.4],
                  outline: {
                    // autocasts as new SimpleLineSymbol()
                    color: [207, 246, 252],
                    width: 2
                  }
                }
            });
      
            clickEvent = view.on("click", (e)=> {
                view.graphics.removeAll();
                pointSelectFeature(e)
            });

            function pointSelectFeature(e) {
                const point = view.toMap(e);

                // 找到用户选择的当前图层ID？？？？这不是个好的编程方法
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
                queryObject.geometry = point;
                queryObject.spatialRelationship ="within";
                queryObject.outFields = ["*"];
              
                // call the executeQueryJSON() method
                query.executeQueryJSON(queryUrl, queryObject).then(function(results) {
                    pointGraphic.geometry = point;
                    polygonGraphic.geometry = results.features[0].geometry;
                    view.graphics.add(pointGraphic);
                    view.graphics.add(polygonGraphic);

                });
            }
        }
    }    
});

