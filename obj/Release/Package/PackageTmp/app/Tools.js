// 定义Tools事件相应函数的模块
define(["esri/config", "app/tools/defaultTool", "app/tools/drawPoint", "app/tools/drawPolyline",
    "app/tools/drawPolygon", "app/tools/drawRectangle", "app/tools/drawCircle", "app/tools/eraseGraphics", "app/tools/pointSelect",
    "app/tools/rectangleSelect", "app/tools/identifyFeature", "app/tools/bufferQuery"],
    function (esriConfig, defaultTool, drawPoint, drawPolyline, drawPolygon, drawRectangle, drawCircle, eraseGraphics,
        pointSelect, rectangleSelect, identifyFeature, bufferQuery) {
        return {
            // 处理图形绘制功能
            handle: function (view, scene) {
                // 起始设置默认工具
                defaultTool.invoke(view, scene);

                // 处理“默认”功能
                $("#defaultTool").click(function () {
                    defaultTool.invoke(view, scene);
                    setActiveTool(this);
                });

                // 处理"画点"功能
                $("#drawPoint").click(function () {
                    drawPoint.invoke(view, scene);
                    setActiveTool(this);
                });

                // 处理“画折线”功能
                $("#drawPolyline").click(function () {
                    drawPolyline.invoke(view, scene);
                    setActiveTool(this);
                });

                // 处理“画多边形”功能
                $("#drawPolygon").click(function () {
                    drawPolygon.invoke(view, scene);
                    setActiveTool(this);
                });

                // 处理“画矩形”功能
                $("#drawRectangle").click(function () {
                    drawRectangle.invoke(view, scene);
                    setActiveTool(this);
                });

                // 处理“画圆”功能
                $("#drawCircle").click(function () {
                    drawCircle.invoke(view, scene);
                    setActiveTool(this);
                });

                // 处理“删除图形”功能
                $("#eraseGraphics").click(function () {
                    eraseGraphics.invoke(view, scene);
                    setActiveTool(this);
                });

                // 处理“点选”功能
                $("#pointSelect").click(function () {
                    pointSelect.invoke(view, scene);
                    setActiveTool(this);
                });

                // 处理“框选”功能
                $("#rectangleSelect").click(function () {
                    rectangleSelect.invoke(view, scene);
                    setActiveTool(this);
                });

                // 处理“识别”功能
                $("#identifyFeature").click(function () {
                    identifyFeature.invoke(view, scene);
                    setActiveTool(this);
                });

                // 处理“缓冲”功能
                $("#bufferQuery").click(function () {
                    bufferQuery.invoke(view, scene);
                    setActiveTool(this);
                });

                // 设置显示当前激活的工具
                function setActiveTool(tool) {
                    $('span[class*="esri-icon"]').removeClass("curTool");
                    $(tool).find('span').addClass("curTool");
                }
            }
        }
    });

