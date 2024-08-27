// 处理User表函数
function editUser(userID) {
    require(["app/trip"], function (trip) {
        trip.editUser(userID);
    })
}

function delUser(userID) {
    require(["app/trip"], function (trip) {
        trip.delUser(userID);
    })
}

function addUser() {
    require(["app/trip"], function (trip) {
        trip.addUser(userID);
    })
}

