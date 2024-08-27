// 定义Menu事件相应函数的模块
define(["esri/config", "esri/widgets/Legend", "app/dialogs/LoadMapService"], 
    function (esriConfig, Legend, LoadMapService) {
    return {
        eventHandle: null,

        invoke: function(view, scene) {
            var me = this;

            var loadMapService = new LoadMapService("LoadMapServiceModal");
            loadMapService.create(view, scene);

            if (me.eventHandle != null) {
                window.removeEventListener("LoadMapServiceEvent", me.eventHandle);
                me.eventHandle = null;
            }
           
            me.eventHandle = loadMapService.on("loadMapService", onLoadMapService);

            // 设置默认的地图url
            loadMapService.setUrl("http://222.200.176.37/arcgis/rest/services/map/china/MapServer");
            
            loadMapService.show();

            // 响应onLoadMapService事件
            function onLoadMapService(e) {
                view.when().then(() => {
                    // 添加当前打开地图服务的图例
                    var legend = new Legend({
                        view: view,
                        layerInfos: [
                        {
                            layer: e.detail.layer,
                            title: e.detail.layer.title
                        }],
                        container: legendList    
                    });

                    e.detail.layer.when(function() {
                        // 缩放地图视图到当前打开的地图服务图层
                        view.goTo(e.detail.layer.fullExtent);
                        setContentTabPage(e);

                        // modify for set current map service card
                        let id0 = "card" + curMapService;
                        $('div[class*="card-header"]').find("a").removeClass("bg-primary");
                        $('div[class*="card-header"]').find("a").removeClass("text-white");

                        $('#' + id0).find("a").addClass("bg-primary");
                        $('#' + id0).find("a").addClass("text-white"); 

                        let selectCard = document.getElementById(id0);
                        selectCard.onclick = function() {
                            $('div[class*="card-header"]').find("a").removeClass("bg-primary");
                            $('div[class*="card-header"]').find("a").removeClass("text-white");
                            $('#' + id0).find("a").addClass("bg-primary");
                            $('#' + id0).find("a").addClass("text-white"); 

                            curMapService = Number(id0.slice(4));
                            view.goTo(mapServiceManage[curMapService]["layer"].fullExtent);
                        }
                    });
                });
            }

            // 设置“内容”标签页的内容
            function setContentTabPage(e) {
                var id = "x" + e.detail.layer.id;
                var id0 = "card" + curMapService;

                var contentList = $("#contentList");
                var card = $('<div class="card"></div>');
                var card_header = $('<div class="card-header" id="' + id0 + '""></div>');
                var card_header_btn = $('<a class="btn" data-bs-toggle="collapse" href="#' + id + '">' + e.detail.layer.title + '</a>');
                
                var card_div = $('<div id="' + id + '" class="collapse show" data-bs-parent="#contentList"></div>');
                var card_div_body = $('<div class="card-body"></div>');

                let serviceType = mapServiceManage[curMapService]["type"];

                if (serviceType == '1') {                            // 如果是MapImageLayer类型
                    for(let i=e.detail.layer.sublayers.length-1; i>=0; i--) {
                        let card_div_body_check = $('<div class="form-check"></div>');
                        let card_div_body_check_input = null;

                        if (i == 0)
                            card_div_body_check_input = $('<input type="radio" class="form-check-input" id="'+ (id + e.detail.layer.sublayers.items[i].id) + 
                                '" name="' + e.detail.layer.title + '" value="' + e.detail.layer.sublayers.items[i].id + '" checked>');
                        else
                            card_div_body_check_input = $('<input type="radio" class="form-check-input" id="'+ (id + e.detail.layer.sublayers.items[i].id) + 
                                '" name="' + e.detail.layer.title + '" value="' + e.detail.layer.sublayers.items[i].id + '" >');

                        let card_div_body_check_label = $('<label class="form-check-label" for="' + (id + e.detail.layer.sublayers.items[i].id) + '">' + 
                            e.detail.layer.sublayers.items[i].title + '</label>');

                        card_div_body_check.append(card_div_body_check_input);
                        card_div_body_check.append(card_div_body_check_label);
                        card_div_body.append(card_div_body_check);
                    }
                }

                if (serviceType == '6') {                            // 如果是FeatureLayer类型
                    let card_div_body_check = $('<div class="form-check"></div>');
                    let card_div_body_check_input = $('<input type="radio" class="form-check-input" id="'+ (id + "1") + 
                        '" name="' + e.detail.layer.title + '" value="' + e.detail.layer.id + '" checked>');
                    let card_div_body_check_label = $('<label class="form-check-label" for="' + (id + "1") + '">' + 
                        e.detail.layer.title + '</label>');

                    card_div_body_check.append(card_div_body_check_input);
                    card_div_body_check.append(card_div_body_check_label);
                    card_div_body.append(card_div_body_check);
                }

                card_div.append(card_div_body);
                card_header.append(card_header_btn);
                card.append(card_header);
                card.append(card_div);
                contentList.append(card);    
            }
        }
    }    
});

