// 实现画点功能
define(["esri/config", "esri/widgets/Sketch/SketchViewModel"], 
    function (esriConfig, SketchViewModel) {
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
            
            sketchViewModel.create("polyline");
        }
    }    
});

