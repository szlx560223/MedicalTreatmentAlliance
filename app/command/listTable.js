// 实现属性列表功能
define(["esri/config", "esri/rest/query", "esri/rest/support/Query","esri/widgets/FeatureTable"], 
    function (esriConfig, query, Query, FeatureTable) {
    return {
        hide: true,

        invoke: function(view, scene) {
            this.hide = !this.hide;

            // 利用esri-hidden的class切换 隐藏/显示 
            if (this.hide) { 
                $('#tableDiv').addClass("esri-hidden");
                $('#tableDiv').empty();
                return;
            }
            else {
                $('#tableDiv').removeClass("esri-hidden");
            }

            // 找到用户选择的当前图层ID？？？？
            let queryUrl = mapServiceManage[curMapService]["url"];
            let serviceType = mapServiceManage[curMapService]["type"];
            let serviceTitle = mapServiceManage[curMapService]["layer"].title;

            if (serviceType == "1") {
                let curLayerId = $("#contentList").find('input[name="' + serviceTitle + '"]:checked').val();

                if (typeof(curLayerId) == 'undefined') return;

                queryUrl = queryUrl + "/" + curLayerId;

                // create the Query object
                let queryObject = new Query();
                queryObject.where = "1 = 1";
                queryObject.outSpatialReference = view.spatialReference;
                queryObject.returnGeometry = false;
                queryObject.outFields = ["*"];
                  
                // call the executeQueryJSON() method
                query.executeQueryJSON(queryUrl, queryObject).then(function(results) {
                    var tableDiv = $('#tableDiv');
                    tableDiv.empty();

                    // 因为layer的id号与它在layer数组中的顺序号是相反的， 所以要作如下减法进行转换。
                    let layerNo = mapServiceManage[curMapService]["layer"].sublayers.items.length - curLayerId - 1;
                    let tableContainer = $('<div class="esri-component mt-2 p-1">' + "图层：" + mapServiceManage[curMapService]["layer"].sublayers.items[layerNo].title +
                        " (返回要素：" + results.features.length + '个)</div>');
                    let table = $('<table class="table table-bordered table-hover table-sm mt-1 p-1"></table>')
                    let table_tbody = $('<tbody></tbody>');
    
                    for(let i=0; i<results.features.length; i++) {
                        let feature = results.features[i];
                        if (i==0) {
                            // 添加表头
                            let table_head = $('<thead></thead>');
                            let table_head_tr = $('<tr></tr>');
                            table_head.append(table_head_tr);

                            for(var key in feature.attributes) {
                                let table_head_tr_th = $('<th>' + key + '</th>');
                                table_head_tr.append(table_head_tr_th);
                            }
                            table.append(table_head);
                        }

                        // 添加表身
                        let table_tbody_tr = $('<tr></tr>');
                        for(var key in feature.attributes) {
                            let table_tbody_tr_td = $('<td>' + feature.attributes[key] + '</td>');
                            table_tbody_tr.append(table_tbody_tr_td);
                        }

                        table_tbody.append(table_tbody_tr);
                    }
                    table.append(table_tbody);
                    tableContainer.append(table);
                    tableDiv.append(tableContainer);
                });
            }
 
            if (serviceType == "6") {
//              let layer = view.layerViews.items[1].layer;
                let layer = mapServiceManage[curMapService]["layer"];
                let featureTable = new FeatureTable( createTable(layer.fields) );

                function createTable(fields) {
                    var table = {};
                    table["layer"] = layer;
                    table["multiSortEnabled"] = true;
                    table["visibleElements"] = {selectionColumn: false};
                    table["fieldConfigs"] = getFieldInfo(fields); 
                    table["container"] = document.getElementById("tableDiv");

                    function getFieldInfo(e) {
                        let fieldConfigs = new Array();
                        for(let i=0; i<e.length; i++) {
                            let fieldConfig = {};
                            fieldConfig["name"] = e[i].name;
                            fieldConfig["label"] = e[i].name;
                            fieldConfigs.push(fieldConfig);
                        }
                        return fieldConfigs;
                    }
                    return table
                }
            }

            view.ui.add("tableDiv", "top-right")
        }
    }
});
