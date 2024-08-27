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

                polygonSymbol:{
                    type:"simple-fill",
                    color:"rgba(38,143,126,0.8)",
                    style:"solid",
                    outline:{
                         color:"yellow",
                         width:3
                    }
               }
            });
            sketchViewModel.create("circle");
        }
    }    
});

