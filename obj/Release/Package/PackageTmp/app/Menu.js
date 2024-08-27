// 定义Menu事件相应函数的模块
define(["esri/config", "app/menu/loadMap", "app/menu/dynamicAddVector", "app/menu/dynamicAddRaster", "app/menu/manageUser"],
    function (esriConfig, loadMap, dynamicAddVector, dynamicAddRaster, manageUser) {
        return {
            handle: function (view, scene) {

                // 响应装载地图菜单功能
                $("#load").click(function () {
                    loadMap.invoke(view, scene);
                });

                // 响应动态加载矢量数据功能
                $("#dynamicAddVector").click(function () {
                    dynamicAddVector.invoke(view, scene);
                });

                // 响应动态加载栅格数据功能
                $("#dynamicAddRaster").click(function () {
                    dynamicAddRaster.invoke(view, scene);
                });

                // 响应管理用户功能
                $("#manageUser").click(function () {
                    manageUser.invoke(view, scene);
                });
            }
        }
    });

