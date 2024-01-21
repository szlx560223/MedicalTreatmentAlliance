// script_leaflet.js
var circleMarker;
// 创建 Leaflet 地图对象
var map = L.map('map-box').setView([23.055156, 113.749171], 15);

// 添加 ArcGIS Server Map Service 地图图层
var mapServiceUrl = 'https://localhost:6443/arcgis/rest/services/test1_db/MapServer';
L.esri.dynamicMapLayer({
    url: mapServiceUrl
}).addTo(map);

// 添加基础地图图层（使用 OpenStreetMap）
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 创建 Geocoder 控件
var geocoder = L.Control.geocoder({
    defaultMarkGeocode: false,
    placeholder: "点击地图或输入地点获取经纬坐标"
});

geocoder.on('markgeocode', function(event) {
    var location = event.geocode.center;

    // 清空上一次搜索结果
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // 在地图上添加标记
    L.marker(location).addTo(map)
        .bindPopup('Location: ' + event.geocode.name)
        .openPopup();

    // 将地图视图定位到选择的位置
    map.setView(location, 15);
});

// 将 Geocoder 控件添加到地图
geocoder.addTo(map);

document.getElementById("search-button").addEventListener("click", function() {
    var locationName = document.getElementById("search-input").value;

    // 执行地理编码
    geocoder.geocode(locationName);
});


L.marker([23.055156, 113.749171]).addTo(map)
    .bindPopup('hello')
    .openPopup();

    


// 添加点击事件监听器
map.on('click', function(event) {
    // 获取点击位置的地理坐标
    var clickedPoint = event.latlng;

    // 在地图上添加高亮效果
    highlightLocation(clickedPoint);

    // 更新经度和纬度搜索框的数值
    document.getElementById("longitude").value = clickedPoint.lng.toFixed(4);
    document.getElementById("latitude").value = clickedPoint.lat.toFixed(4);

    // 创建 IdentifyTask 对象
    var identifyTask = new L.esri.Tasks.IdentifyTask(mapServiceUrl);

    // 创建 IdentifyParameters
    var identifyParams = L.esri.identifyParameters({
        layers: [0, 1, 2, 3], // 图层的索引，根据实际情况调整
        tolerance: 3,
        geometry: event.latlng,
        mapExtent: map.getBounds(),
        width: map.getSize().x,
        height: map.getSize().y
    });

    // 发送 Identify 请求
    identifyTask.identify(identifyParams, function (error, results) {
        if (!error) {
            if (results.results.length > 0) {
                // 获取第一个识别结果的属性
                var attributes = results.results[0].attributes;

                // 获取医院名称字段的值
                var hospitalName = attributes["医院名称"];

                // 在弹出窗口中显示医院名称
                var popupContent = "医院名称: " + hospitalName;
                circleMarker.bindPopup(popupContent).openPopup();
            } else {
                // 如果未找到识别结果，显示默认弹出窗口内容
                var popupContent = "经度: " + event.latlng.lng.toFixed(4) + "<br>纬度: " + event.latlng.lat.toFixed(4);
                circleMarker.bindPopup(popupContent).openPopup();
            }
        }
    });
});

// 使用 CircleMarker 绘制圆形标记
function highlightLocation(latlng) {
    // 创建圆形标记
    var circleMarker = L.circleMarker(latlng, {
        radius: 10,
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5
    }).addTo(map);

    // 弹出窗口内容
    var popupContent = "经度: " + latlng.lng.toFixed(4) + "<br>纬度: " + latlng.lat.toFixed(4);

    // 添加弹出窗口
    circleMarker.bindPopup(popupContent).openPopup();

    // 延迟一定时间后清除标记
    setTimeout(function () {
        map.removeLayer(circleMarker);
    }, 1000); // 这里的3000表示延迟时间，单位为毫秒
}

// 获取查询按钮元素
var queryLocationButton = document.getElementById("nearest-hospital");

queryLocationButton.addEventListener("click", function() {
    var longitude = parseFloat(document.getElementById("longitude").value);
    var latitude = parseFloat(document.getElementById("latitude").value);

    queryLocation(longitude, latitude);
});


function queryLocation(longitude, latitude) {
    // 构建请求体

    // 使用fetch发送POST请求
    fetch('http://localhost:3000/query-location', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ longitude, latitude }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        // 处理服务器的响应
        const resultBox = document.getElementById("hospital-attributes");

        // 清空之前的结果
        resultBox.innerHTML = "";

        if (result.success) {
             // 动态构建表格
             const table = document.createElement('table');
             table.border = '1';

             // 添加表头
             const headerRow = table.insertRow();
             ['诊疗体级别', '医院名', '位置'].forEach((header) => {
                 const th = document.createElement('th');
                 th.textContent = header;
                 headerRow.appendChild(th);
             });

             // 添加数据行
             result.data.forEach((row) => {
                 const dataRow = table.insertRow();
                 ['level', '医院名', '地址'].forEach((key) => {
                     const cell = dataRow.insertCell();
                     cell.textContent = row[key];
                 });
            // 为医院链接添加一个链接单元格
            const linkCell = dataRow.insertCell();
            const link = document.createElement('a');
            link.textContent = '医院链接';
            link.href = row['医院链接'];
            link.target = '_blank'; // 在新标签页中打开链接
            linkCell.appendChild(link);
        });

             resultBox.appendChild(table);
         } else {
             // 显示错误消息到页面
             resultBox.innerHTML = '查询失败：' + result.error;
         }
     })
     .catch((error) => {
         console.error('Error:', error);
         // 处理其他错误
         const resultBox = document.getElementById('hospital-attributes');
         resultBox.innerHTML = '发生错误：' + error.message;
     });
    }


// 

// 创建 Geocoder 控件
var geocoder = L.Control.Geocoder.nominatim();

geocoder.on('markgeocode', function(event) {
    var location = event.geocode.center;

    // 清空上一次搜索结果
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // 在地图上添加标记
    L.marker(location).addTo(map)
        .bindPopup('Location: ' + event.geocode.name)
        .openPopup();

    // 将地图视图定位到选择的位置
    map.setView(location, 15);
});

// 将 Geocoder 控件添加到地图
map.addControl(geocoder);

document.getElementById("search-button").addEventListener("click", function() {
    var locationName = document.getElementById("search-input").value;

    // 执行地理编码
    geocoder.geocode(locationName);
});




