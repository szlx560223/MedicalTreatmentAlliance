// 定义ManageUser对象，并放在模块中，动态生成一个ManageUser的网页对话框(dialog).
define(["dojo/_base/declare", "app/tools"], 
        function(declare, tools) {
    return declare("ManageUser", null,  {
        constructor : function(id) {
            this._id = id;
            this._viewModel = null;

        },

        getID: function() {
            return this._id;
        },

        getViewModel: function() {
            return this._viewModel;
        },


        show: function() {
            this._viewModel.show(); 
            //fillLayers();

            var me = this;

        },

        hide: function() {
            this._viewModel.hide();
        },

        remove: function() {
            this._viewModel.dispose();
            $("#" + this._id).remove();
        },


        create: function () {
            var me = this;

            createUI(me._id);
            this._viewModel = bootstrap.Modal.getOrCreateInstance(document.getElementById(this._id));
            fillUserTable();

            $("#exitManageUser").click(function() {
                me.hide();
                me.remove();
            });

            return this._viewModel;

            // 利用jQuery动态创建dom元素，完成modal对话框UI
            function createUI(id) {
                var me = this;

                var body = $('body');
                var div = $('<div class="modal fade" ' + 'id="' + id + '"' + 'data-bs-backdrop="static" data-bs-keyboard="false"></div>');

                var div1 = $('<div class="modal-dialog modal-dialog-centered manage-user">\
                    <div class="modal-content">\
                        <div class="modal-header p-2">\
                            <h5 class="modal-title ms-3">用户管理</h6>\
                        </div>\
                        <div class="modal-body">\
                            <div class="container">\
                                <div class="row">\
                                    <div class="col-sm-12">\
                                        <div>\
                                            <table id="userManage" class="table table-hover" data-toolbar=".toolbar" ></table>\
                                        </div >\
                                        <div id="toolbar" class="toolbar mt-0">\
                                            <button type="button" class="btn btn-primary" id="addUser">添 加</button>\
                                            <button type="button" class="btn btn-warning" id="exitManageUser">退 出</button>\
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

            // 
            function fillUserTable() {
                var rows = 8;
                $('#userManage').bootstrapTable({
                    method: 'get',
                    url: "handle.ashx",//请求路径
                    striped: true, //是否显示行间隔色
                    pageNumber: 1, //初始化加载第一页
                    pagination: true,//是否分页
                    sidePagination: 'server',//server:服务器端分页|client：前端分页
                    pageSize: rows,//单页记录数
                  //  pageList: [5, 10, 20, 30],//可选择单页记录数
                    sortOrder: "asc",
                    sortable: true,
                //    clickToSelect: true,
                    cache: false,
                    unqiueId: "userID",
                 //   showToggle: true,
                //    showRefesh: true,
                    queryParams: function (params) {//上传服务器的参数
                        var temp = {  //如果是在服务器端实现分页，limit、offset这两个参数是必须的
                            start: params.offset, // SQL语句起始索引
                            limit: params.limit, // 每页显示数量
                            page: (params.offset / params.limit) + 1, //当前页码
                            action: "GetUsersByParam",
                        }
                        return temp;
                    },
                    columns: [
                        { title: '用户ID', field: 'userID', width: 100, sortable: true },
                        { title: '姓名', field: 'name', width: 20, sortable: false },
                        { title: '性别', field: 'sex', width: 10, sortable: false },
                        { title: '年龄', field: 'age', width: 10, sortable: false },
                        { title: '城市编号', field: 'cityNo', width: 50, sortable: false },
                        { title: '说明', field: 'summary', width: 30, sortable: false },
                        { title: '操作', field:'userID', width:90, valign:'middle', formatter:actionFormatter}
                    ],

                    onDblClickRow: function (row, $element) { },
                    responseHandler: function (response) {
                        return {
                            "rows": response.Result.Rows,
                            "total": response.Result.Total
                        }
                    }
                });
            }
             
            function actionFormatter(value, row, index) {
                let userID = value;
                let format = "";

                format += "<button type='button' class='btn btn-xs btn-success ms-1' onclick='editUser(\"" + userID + "\")'>编辑</bttton>";
                format += "<button type='button' class='btn btn-xs btn-danger ms-1' onclick='delUser(\"" + userID + "\")'>删除</bttton>";

                return format;

            }
        }
    });
});

