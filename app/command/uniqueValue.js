// 实现唯一值渲染功能
define(["esri/config", "esri/Color"], 
    function (esriConfig, Color) {
    return {
        invoke: function(view ,scene) {
            var renderer = {
                type: "unique-value",                    // autocasts as new UniqueValueRenderer()
                field: "adcode",
                defaultSymbol: { type: "simple-fill" },  // autocasts as new SimpleFillSymbol()
            };
            
            let layer = mapServiceManage[curMapService]["layer"];
            layer.queryFeatures({
                outFields: ["*"],
                where: "1 = 1"
            }).then((featureSet) => {
                function getValueInfo(featureSet) {
                    let uniqueValueInfos = new Array();

                    for(let i=0; i<featureSet.features.length; i++) {
                        let valueInfo = {};
                        valueInfo["value"] = featureSet.features[i].attributes["adcode"];

                        let symbol = {};
                        symbol["type"] =  "simple-fill";
                        let color = new Color(randomColor());
                        symbol["color"] = color;

                        valueInfo["symbol"] = symbol;
                        uniqueValueInfos.push(valueInfo);
                    }
                    return uniqueValueInfos;
                }
                renderer["uniqueValueInfos"] = getValueInfo(featureSet);
                layer.renderer = renderer;
            });
        }
    }    
});

