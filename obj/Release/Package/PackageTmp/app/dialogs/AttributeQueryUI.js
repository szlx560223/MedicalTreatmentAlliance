// 定义AttributeQuery对象，并放在模块中，动态生成一个AttributeQyery的网页对话框(dialog).
define(["dojo/_base/declare", "esri/config", "esri/request", "esri/rest/query", "esri/rest/support/Query"], 
        function(declare, esriConfig, esriRequest, query, Query) {
    return declare("AttributeQueryUI", null,  {
        constructor : function(id) {
            this._id = id;
            this._viewModel = null;
            this._map = null;
            this._view = null;
            this._scene = null;
            this._fields = null;

        },

        getID: function() {
            return this._id;
        },

        getViewModel: function() {
            return this._viewModel;
        },

        show: function() {
            this._viewModel.show(); 
            fillLayers();

            var me = this;

            // 根据当前地图服务图层，填充图层Layer选择框
            function fillLayers() {
                if (curMapService == -1) return;
                $("#selectLayer").empty();
                let optionText = "选择图层";
                let optionValue = "-1";
                $("#selectLayer").append(new Option(optionText, optionValue));

                if (mapServiceManage[curMapService].type == "1") {                      // MapImageLayer
                    for(let i=mapServiceManage[curMapService].layer.sublayers.length-1; i>=0; i--) {
                        let optionText = mapServiceManage[curMapService].layer.sublayers.items[i].title;
                        let optionValue = mapServiceManage[curMapService].layer.sublayers.items[i].id;
                       $("#selectLayer").append(new Option(optionText, optionValue));
                    }   
                }

                if (mapServiceManage[curMapService].type == "6") {                      // FeatureLayer
                    let optionText = mapServiceManage[curMapService].layer.title;
                    let optionValue = mapServiceManage[curMapService].layer.id;
                   $("#selectLayer").append(new Option(optionText, optionValue));
                }

                // 响应列表框的change事件， 填充字段名称.
                $("#selectLayer").change(fillFields);
            }

            // 根据当前选中的Layer， 填充字段Field选择框
            function fillFields() {
                let layerId = $("#selectLayer option:selected").val();
                if (layerId == null) return;

                $("#selectField").empty();
                let optionText = "选择字段";
                let optionValue = "-1";
                $("#selectField").append(new Option(optionText, optionValue));

                serviceType = mapServiceManage[curMapService]["type"];
                serviceUrl =  mapServiceManage[curMapService]["url"];

                let url = serviceUrl;
                if (serviceType == "1")
                    url = serviceUrl + "/" + layerId + "?f=pjson";
                
                if (serviceType == "6")
                    url = serviceUrl + "?f=pjson";

                // 利用esriRequest获取地图服务图层字段信息
                esriRequest(url, {
                    responseType: "json"
                }).then(function(response) {
                // The requested data
                    let res = response.data;
                    me._fields = res.fields;                // 记住Fields供查询时使用
                    for(let i=0; i<res.fields.length; i++) {
                        if (res.fields[i].type != "esriFieldTypeGeometry") {
                            let optionText = res.fields[i].name;
                            let optionValue = res.fields[i].name;

                            $("#selectField").append(new Option(optionText, optionValue));
                        }
                    }
                });                

                // 响应列表框的change事件，填充字段的值.
                $("#selectField").change(fillValue);
            }

            // 根据当前选中的字段Field, 填充字段的值
            function fillValue() {
                $("#selectValue").empty();
                let optionText = "选择段值";
                let optionValue = "-1";
                $("#selectValue").append(new Option(optionText, optionValue));

                let layerId = $("#selectLayer option:selected").val();
                if (layerId == null) return;

                serviceType = mapServiceManage[curMapService]["type"];
                serviceUrl =  mapServiceManage[curMapService]["url"];
                let queryUrl = serviceUrl;
                if (serviceType == "1")
                    queryUrl = serviceUrl + "/" + layerId;

                let field = $("#selectField option:selected").val();
                let queryObject = new Query();
                queryObject.where = "1 = 1";
                queryObject.outSpatialReference = me._view.spatialReference;
                queryObject.returnGeometry = false;
                queryObject.outFields = [field];

                // call the executeQueryJSON() method
                query.executeQueryJSON(queryUrl, queryObject).then(function(results) {
                    for(let i=0; i<results.features.length; i++) {
                        let featureAttributes = results.features[i].attributes;
                        for (var attr in featureAttributes) {
                            if (featureAttributes[attr] != null) {
                                let optionText = featureAttributes[attr].toString();
                                let optionValue = featureAttributes[attr].toString();
                                $("#selectValue").append(new Option(optionText, optionValue));
                            }
                        }
                    }
                });
            }
        },

        hide: function() {
            this._viewModel.hide();
        },

        remove: function() {
            this._viewModel.dispose();
            $("#" + this._id).remove();
        },


        create: function(view, scene) {
            var me = this;

            createUI(me._id);
            this._viewModel = bootstrap.Modal.getOrCreateInstance(document.getElementById(this._id));

            // 为“装载”按钮添加click事件
            this._view = view;
            this._scene = scene;
            this._map = view.map;


            $("#executeQuery").click(executeQuery);
            $("#exitQuery").click(function() {
                me.hide();
                me.remove();
            });

            return this._viewModel;

            // 利用jQuery动态创建dom元素，完成modal对话框UI
            function createUI(id) {
                var body = $('body');
                var div = $('<div class="modal" ' + 'id="' + id + '"' + 'data-bs-backdrop="static" data-bs-keyboard="false"></div>');

                var div1 = $('<div class="modal-dialog modal-dialog-centered attribute-query">\
                    <div class="modal-content">\
                        <div class="modal-header">\
                            <h5 class="modal-title">属性查询</h6>\
                        </div>\
                        <div class="modal-body">\
                                <div class="container">\
                                    <div class="row">\
                                        <div class="col-sm-3 p-0 mb-2">\
                                            <div class="mb-1 mt-1 p-0">\
                                                <label for="选择图层" class="form-label">选择图层:</label>\
                                                <select class="form-select combobox" aria-label="" id="selectLayer">\
                                                </select>\
                                                <label for="选择字段" class="form-label mt-3">选择字段:</label>\
                                                <select class="form-select combobox" aria-label="" id="selectField">\
                                                </select>\
                                                <label for="选择条件" class="form-label mt-3">选择条件:</label>\
                                                <select class="form-select combobox" aria-label="" id="selectOperator">\
                                                    <option selected value="=">=</option>\
                                                    <option value=">">></option>\
                                                    <option value=">=">>=</option>\
                                                    <option value="<"><</option>\
                                                    <option value="<="><=</option>\
                                                    <option value="like">like</option>\
                                                </select>\
                                                <label for="选择段值" class="form-label mt-3">选择段值:</label>\
                                                <select class="form-select combobox" aria-label="" id="selectValue">\
                                                </select>\
                                            </div>\
                                            <button type="button" class="btn btn-primary mt-3 me-2" id="executeQuery">查询</button>\
                                            <button type="button" class="btn btn-warning mt-3" id="exitQuery">退出</button>\
                                        </div>\
                                        <div class="col-sm-9 p-0">\
                                            <div class="attribute-query-right ms-2">\
                                                <div class="attribute-query-table m-1" id="queryTable">\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                        </div>\
                    </div>\
                </div>');

                div.append(div1);
                body.append(div);
    
            }

            // 属性查询
            function executeQuery() {

                let layerId = $("#selectLayer option:selected").val();
                if (layerId == "-1") {
                    alert("请选择一个图层！");
                    return;
                }

                let field = $("#selectField option:selected").val();
                if (field == "-1") {
                    alert("请选择一个字段！");
                    return;
                }

                let fieldValue = $("#selectValue option:selected").val();
                if (fieldValue == "-1") {
                    alert("请选择一个段值！");
                    return;
                }

                let operator = $("#selectOperator option:selected").val();

                serviceType = mapServiceManage[curMapService]["type"];
                serviceUrl =  mapServiceManage[curMapService]["url"];
                let queryUrl = serviceUrl;
                if (serviceType == "1")
                    queryUrl = serviceUrl + "/" + layerId;

                let queryObject = new Query();

                me._fields.forEach(function (element) {
                    if (element.name == field) {
                        if (element.type == "esriFieldTypeString")
                            queryObject.where = element.name + operator + "'" + fieldValue + "'";
                        else
                            queryObject.where = element.name + operator + fieldValue;
                    }
                })

                queryObject.outSpatialReference = me._view.spatialReference;
                queryObject.returnGeometry = false;
                queryObject.outFields = ["*"];

                // call the executeQueryJSON() method
                query.executeQueryJSON(queryUrl, queryObject).then(function(results) {
                    var tableDiv = $('#queryTable');
                    tableDiv.empty();
                    let tableContainer = null;

                    if (serviceType == "1") {
                        // 因为layer的id号与它在layer数组中的顺序号是相反的， 所以要作如下减法进行转换。
                        let layerNo = mapServiceManage[curMapService]["layer"].sublayers.items.length - layerId - 1;
                        tableContainer = $('<div class="esri-component mt-2 p-1">' + "图层：" + mapServiceManage[curMapService]["layer"].sublayers.items[layerNo].title +
                            " (返回要素：" + results.features.length + '个)</div>');
                    }

                    if (serviceType == "6") {
                        tableContainer = $('<div class="esri-component mt-2 p-1">' + "图层：" + mapServiceManage[curMapService]["layer"].title +
                            " (返回要素：" + results.features.length + '个)</div>');
                    }

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
        }
    });
});
