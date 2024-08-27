// 定义LoadMapService对象，并放在模块中，动态生成一个DynamicAddVector的网页对话框(dialog).
define(["dojo/_base/declare", "esri/config" ], 
        function(declare, esriConfig) {
    return declare("DynamicAddVector", null,  {
        constructor : function(id) {
            this._id = id;
            this._viewModel = null;
            this._map = null;
            this._view = null;
            this._scene = null
        },

        getID: function() {
            return this._id;
        },

        getViewModel: function() {
            return this._viewModel;
        },

        // 设置初始的地图服务的url地址
        show: function() {
            this._viewModel.show();        
        },

        hide: function() {
            this._viewModel.hide();
        },

        remove: function() {
            this._viewModel.dispose();
            $("#" + this._id).remove();
        },

        // 通过on方法，把事件响应的函数由外面传递进来
        on: function(name, fn) {
            if (name == "dynamicAddVector") {
                window.addEventListener("DynamicAddVectorEvent", fn);
            }
            return fn;
        },

        create: function(view, scene) {
            var me = this;

            createUI(me._id);
            this._viewModel = bootstrap.Modal.getOrCreateInstance(document.getElementById(this._id));

            // 为“装载”按钮添加click事件
            this._view = view;
            this._scene = scene;
            this._map = view.map;


            $("#addVector").click(dynamicAddVector);

            // 当模式对话框隐藏时释放模式框对象及对应的DOM元素
            $("#" + this._id).on("hidden.bs.modal", function() {
                window.removeEventListener("DynamicAddVectorEvent", null);
                me._viewModel.dispose();
                $("#" + me._id).remove();
            });

            return this._viewModel;

            // 利用jQuery动态创建dom元素，完成modal对话框UI
            function createUI(id) {
                var body = $('body');
                var div = $('<div class="modal" ' + 'id="' + id + '"' + '></div>');
    
                var div1 = $(
                    '<div class="modal-dialog modal-dialog-centered modal-md">\
                        <div class="modal-content">\
                            <div class="modal-header">\
                                <h5 class="modal-title">动态加载矢量数据</h5>\
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>\
                            </div>\
                            <div class="modal-body">\
                                <form>\
                                    <div class="mb-2 mt-2">\
                                        <select class="form-select" aria-label="" id="vectorOptional">\
                                            <option selected value="0">选择一个注册的矢量数据</option>\
                                            <option value="Wind.shp">风场(Wind.shp)</option>\
                                            <option value="roa_4m.shp">国道(roa_4m.shp)</option>\
                                        </select>\
                                    </div>\
                                    <button type="button" class="btn btn-primary mb-2" id="addVector">加载</button>\
                                </form>\
                            </div>\
                                <div class="modal-footer">\
                                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">关闭</button>\
                                </div>\
                        </div>\
                    </div>');
       
                div.append(div1);
                body.append(div);
            }

            // 动态加载矢量数据
            function dynamicAddVector() {
                let vectorName = $("#vectorOptional option:selected").val();

                // 添加服务事件addDynamicVectorEvent
                me._viewModel.hide();

                let event = null;    
                event = new CustomEvent("DynamicAddVectorEvent", {bubbles: true, detail: {name: vectorName }});
                window.dispatchEvent(event);
            }
        }
    });
});
