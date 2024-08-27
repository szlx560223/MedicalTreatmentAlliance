// 实现缓冲查询功能
define(["esri/config", "esri/widgets/Sketch/SketchViewModel", "esri/rest/geometryService", "esri/rest/support/BufferParameters",
        "esri/geometry/SpatialReference", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/Graphic", "esri/Color"], 
    function (esriConfig, SketchViewModel, geometryService, BufferParameters, SpatialReference, SimpleFillSymbol, SimpleLineSymbol, Graphic, Color) {
    return {
        invoke: function(view ,scene) {
            if (clickEvent != null) {
                clickEvent.remove();
                clickEvent = null;
            }

            const sketchViewModel = new SketchViewModel({
                view:view,
                layer: view.graphics,

                pointSymbol:{
                    type:"simple-marker",
                    style:"square",
                    color:"#2AFEE3",
                    size:"16px",
                    outline:{
                        color:[255,0,0],
                        width:3
                    }
                }
            });
            
            //const bufferServiceUrl = "https://utility.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer"  
            const bufferServiceUrl = "https://localhost:6443/arcgis/rest/services/Utilities/Geometry/GeometryServer";
            sketchViewModel.on("create", function(event) {
                if (event.state === "complete") {
                    var bufferDistance = prompt("请输入缓冲距离(单位：公里)", 10);

                    if (bufferDistance != "" && bufferDistance != null)
                        doBuffer(event, bufferDistance);
                }
            });
            sketchViewModel.create("polyline");

            function doBuffer(event, dis) {
                var params = new BufferParameters({
                    geometries: [event.graphic.geometry],
                    distances: dis,
                    unit: "kilometers",
                    outSpatialReference: view.spatialReference,
                    bufferSpatialReference: new SpatialReference({ wkid: 102113 })
                });
    
                geometryService.buffer(bufferServiceUrl, params).then(function (results) {
                    doQuery(results)
                });
            }

            function doQuery(results) {
                const symbol = new SimpleFillSymbol({
                    style: "none",
                    outline: new SimpleLineSymbol({
                        style: "dash-dot",
                        color: new Color([255, 0, 0]),
                        width: 2
                    }),
                    color: new Color([255, 255, 0, 0.25])
                });
                let graphic = new Graphic({
                    geometry: results[0],
                    symbol: symbol
                });
                view.graphics.add(graphic);
            }
        }
    }    
});

