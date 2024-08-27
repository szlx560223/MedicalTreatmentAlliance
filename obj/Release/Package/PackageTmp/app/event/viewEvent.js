// 处理MapView的相关事件的模块
define(null, function () {
    return {
        invoke: function(view) {

            onPointerMove(view);                // 处理 pointer_move事件
     //       onClick(view);                      // 处理 Click事件

            // MapView的具体Event处理：
            // 处理pointer-move事件
            function onPointerMove(view) {
                view.on("pointer-move", function(e) {
                    let point = {x: e.x, y:e.y};
                    let mapPoint = view.toMap(point);
                    let lat = Math.round(mapPoint.latitude * 1000) / 1000;
                    let lon = Math.round(mapPoint.longitude * 1000) / 1000;
                    $("#footerDiv")[0].innerHTML = "坐标：[" + lat + "," + lon + "]";

                });
            }

        }
    }
});
