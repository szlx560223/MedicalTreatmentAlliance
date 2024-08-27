// 定义Menu事件相应函数的模块
define(["esri/config", "esri/widgets/Legend", "esri/layers/MapImageLayer"],
    function (esriConfig, Legend, MapImageLayer) {
        return {
            // 打开应用地图
            openTripMap: function (view) {
                layer = new MapImageLayer({
                    url: service_url,
                    opacity: 0.9,
                });

                view.map.add(layer);
                view.when().then(() => {
                    layer.findSublayerById(3).visible = false;
                    layer.findSublayerById(4).visible = false;

                    var legend = new Legend({
                        view: view,
                        layerInfos: [
                            {
                                layer: layer,
                                title: layer.title
                            }],
                        container: legendList
                    });
                    view.goTo(layer.fullExtent);

                    // 以下代码与后面实现的功能无关，只是为了兼容前面的示例
                    layer.when(function () {
                        setContentTabPage(layer);
                        let id0 = "card" + curMapService;
                        $('div[class*="card-header"]').find("a").removeClass("bg-primary");
                        $('div[class*="card-header"]').find("a").removeClass("text-white");

                        $('#' + id0).find("a").addClass("bg-primary");
                        $('#' + id0).find("a").addClass("text-white");

                        let selectCard = document.getElementById(id0);
                        selectCard.onclick = function () {
                            $('div[class*="card-header"]').find("a").removeClass("bg-primary");
                            $('div[class*="card-header"]').find("a").removeClass("text-white");
                            $('#' + id0).find("a").addClass("bg-primary");
                            $('#' + id0).find("a").addClass("text-white");

                            curMapService = Number(id0.slice(4));
                            view.goTo(mapServiceManage[curMapService]["layer"].fullExtent);
                        }
                    });
                });

                // 以下代码与后面实现的功能无关，只是为了兼容前面的示例
                function setContentTabPage(e) {
                    let mapService = {};
                    mapService["type"] = "1";
                    mapService["url"] = service_url;
                    mapService["layer"] = layer;
                    mapServiceManage.push(mapService);
                    curMapService = mapServiceManage.length - 1;

                    var id = "x" + e.id;
                    var id0 = "card" + curMapService;

                    var contentList = $("#contentList");
                    var card = $('<div class="card"></div>');
                    var card_header = $('<div class="card-header" id="' + id0 + '""></div>');
                    var card_header_btn = $('<a class="btn" data-bs-toggle="collapse" href="#' + id + '">' + e.title + '</a>');

                    var card_div = $('<div id="' + id + '" class="collapse show" data-bs-parent="#contentList"></div>');
                    var card_div_body = $('<div class="card-body"></div>');

                    let serviceType = mapServiceManage[curMapService]["type"];

                    if (serviceType == '1') {                            // 如果是MapImageLayer类型
                        for (let i = e.sublayers.length - 1; i >= 0; i--) {
                            let card_div_body_check = $('<div class="form-check"></div>');
                            let card_div_body_check_input = null;
                            if (i == 0)
                                card_div_body_check_input = $('<input type="radio" class="form-check-input" id="' + (id + e.sublayers.items[i].id) +
                                    '" name="' + e.title + '" value="' + e.sublayers.items[i].id + '" checked>');
                            else
                                card_div_body_check_input = $('<input type="radio" class="form-check-input" id="' + (id + e.sublayers.items[i].id) +
                                    '" name="' + e.title + '" value="' + e.sublayers.items[i].id + '" >');

                            let card_div_body_check_label = $('<label class="form-check-label" for="' + (id + e.sublayers.items[i].id) + '">' +
                                e.sublayers.items[i].title + '</label>');

                            card_div_body_check.append(card_div_body_check_input);
                            card_div_body_check.append(card_div_body_check_label);
                            card_div_body.append(card_div_body_check);
                        }
                    }

                    card_div.append(card_div_body);
                    card_header.append(card_header_btn);
                    card.append(card_header);
                    card.append(card_div);
                    contentList.append(card);

                    id0 = "card" + curMapService;
                    $('div[class*="card-header"]').find("a").removeClass("bg-primary");
                    $('div[class*="card-header"]').find("a").removeClass("text-white");

                    $('#' + id0).find("a").addClass("bg-primary");
                    $('#' + id0).find("a").addClass("text-white");

                    let selectCard = document.getElementById(id0);
                    selectCard.onclick = function () {
                        $('div[class*="card-header"]').find("a").removeClass("bg-primary");
                        $('div[class*="card-header"]').find("a").removeClass("text-white");
                        $('#' + id0).find("a").addClass("bg-primary");
                        $('#' + id0).find("a").addClass("text-white");

                        curMapService = Number(id0.slice(4));
                    }
                }
            },

            // 显示用户列表
            showUsers: function (view) {
				var me = this;
				
                $.get("handle.ashx",
                    { action: "GetAllUsers"}, function (response) {

                        let res = $.parseJSON(response)
                        fillUsers(res.Result.Rows);

                        $('#userDiv').removeClass("esri-hidden");
                        view.ui.add("userDiv", "top-left")
						
                        let refreshUsers = document.getElementById("refreshUsers");
                        refreshUsers.onclick = function () {
                            me.showUsers(view);
                        }
                    });

                function fillUsers(e) {
                    $("#userDiv").empty();
                    let userDiv = $("#userDiv");
                    let userDiv1 = $("<div></div>");
                    userDiv1.append('<div class="esri-widget esri-widget--button esri-interactive" title="刷新" id="refreshUsers">\
                        <span class="esri-icon-refresh curTool"></span></div>');
                    let userDiv2 = $("<div id='userTableDiv' class='userDiv p-1'></div>");

                    for (let i = 0; i < e.length; i++) {
                        let div_check = $('<div class="form-check"></div>');
                        let div_check_input = null;
                        if (i==0)
                            div_check_input = $('<input type="radio" class="form-check-input" id="' + ("u" + e[i].userID) +
                                '" name="optradio1" value="' + e[i].userID + '" checked>');
                        else
                            div_check_input = $('<input type="radio" class="form-check-input" id="' + ("u" + e[i].userID) +
                                '" name="optradio1" value="' + e[i].userID + '">');

                        let div_check_label = $('<label class="form-check-label" for="' + ("u" + e[i].userID) + '">' +
                            e[i].name + '</label>');

                        div_check.append(div_check_input);
                        div_check.append(div_check_label);
                        userDiv2.append(div_check);
                    }
                    userDiv.append(userDiv1);
                    userDiv.append(userDiv2);
                }
            },

            // 处理了User表
            editUser: function (userID) {
                alert("editUser id = " + userID);
            },

            delUser: function (userID) {
                alert("delUser id = " + userID);
            }
        }
    });

