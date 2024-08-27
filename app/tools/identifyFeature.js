// 实现识别要素功能
define(["esri/config","esri/rest/identify", "esri/rest/support/IdentifyParameters"], 
    function (esriConfig, identify, IdentifyParameters) {
    return {
        invoke: function(view ,scene) {
            if (clickEvent != null) {
                clickEvent.remove();
                clickEvent = null;
            }

            // var identifyURL = service_url;
            var identifyURL = mapServiceManage[curMapService]["url"];

            var params = new IdentifyParameters();
            params.tolerance = 3;
//            params.layers = view.map.sublayers;
            params.layers = mapServiceManage[curMapService]["layer"].sublayers;
            params.layerOption = "visible";
            params.width = view.width;
            params.height = view.height;
   
            clickEvent = view.on("click", (e)=> {
                view.graphics.removeAll();
                identifyFeature(e)
            });

            function identifyFeature(e) {
                params.geometry = e.mapPoint;
                params.mapExtent = view.extent;
                document.getElementById("mapDiv").style.cursor = "wait";

                identify.identify(identifyURL, params).then(function(response) {
                    var results = response.results;
                    return results.map(function(result) {
                        var feature = result.feature;
                        var layerName = result.layerName;

                        feature.attributes.layerName = layerName;
                        let templateJSON = getTemplateJSON(feature);
                        feature.popupTemplate = templateJSON;

                        // 读取要素的内容
                        function getTemplateJSON(e) {
                            var json = {};
                            json["title"] = layerName;

                            let content = "";
                            for(var key in e.attributes) {
                                content += "<b>" + key + ":</b> {" + key + "} <br>";
                            }
                            json["content"] = content;

                            return json;
                        }
                        return feature;
                    });
                }).then(showPopup);

                function showPopup(response) {
                    if (response.length > 0) {
                      view.popup.open({
                        features: response,
                        location: e.mapPoint
                      });
                    }
                }
                document.getElementById("mapDiv").style.cursor = "auto";
            }
        }
    }    
});

