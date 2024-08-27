// 实现画点功能
define(["esri/config", "esri/widgets/Sketch/SketchViewModel"], 
    function (esriConfig, SketchViewModel) {
    return {
        invoke: function(view ,scene) {
            if (clickEvent != null) {
                clickEvent.remove();
                clickEvent = null;
            }
          
            clickEvent = view.on("click", function(event) {
                view.popup.autoOpenEnabled = false;
    
                // Get the coordinates of the click on the view
                let lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
                let lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
    
                view.popup.open({
                    // Set the popup's title to the coordinates of the location
                    title: "经纬度: [" + lon + ", " + lat + "]",
                    location: event.mapPoint, // Set the location of the popup to the clicked location
                    content: "这是坐标位置"  // content displayed in the popup
                });
            });
        }
    }    
});

