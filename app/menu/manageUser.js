// 定义Menu事件相应函数的模块
define(["esri/config", "app/dialogs/ManageUser"],
    function (esriConfig, ManageUser) {
        return {

            invoke: function (view, scene) {
                var manageUser = new ManageUser("ManageUserModal");
                manageUser.create();
                manageUser.show();
            }
        }
    });

