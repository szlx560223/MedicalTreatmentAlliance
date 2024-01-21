const express = require('express');
const { Pool } = require('pg');
const app = express();
const cors = require('cors');
// 使用 cors 中间件启用 CORS
app.use(cors());
app.use(express.json());

const pgp = require('pg-promise')();
// 连接到 PostGIS 数据库
// const db = pgp('postgres://postgres:Ry1203428@localhost:5432/finalhw');
const db = pgp({
    connectionString: 'postgres://postgres:Ry1203428@localhost:5432/finalhw'
});
db.one('SELECT 1')
    .then(result => {
        // 查询成功，说明连接成功
        console.log('Database connection successful');
    })
    .catch(error => {
        // 查询失败，说明连接有问题
        console.error('Error executing query:', error);
    });


// 处理前端传递的查询请求
app.post('/query-location', async (req, res) => {
    try {
        // 从请求中获取经度和纬度
        const { longitude, latitude } = req.body;

        // 在此执行 PostGIS 查询
        const query3 = `
            SELECT 医院名,地址,医院链, ST_AsText(geom) AS location
            FROM dg_hosip3
            ORDER BY ST_Distance(ST_AsText(geom)::geography, ST_MakePoint($1, $2))
            LIMIT 1;
        `;
        const result3 = await db.one(query3, [longitude, latitude]);
        const query2 = `
            SELECT 医院名,地址,医院链, ST_AsText(geom) AS location
            FROM dg_hosip2
            ORDER BY ST_Distance(ST_AsText(geom)::geography, ST_MakePoint($1, $2))
            LIMIT 1;
        `;
        const result2 = await db.one(query2, [longitude, latitude]);
        const query1 = `
            SELECT 医院名,地址,医院链, ST_AsText(geom) AS location 
            FROM dg_hosip1
            ORDER BY ST_Distance(ST_AsText(geom)::geography, ST_MakePoint($1, $2))
            LIMIT 1;
        `;
        const result1 = await db.one(query1, [longitude, latitude]);
        const query0 = `
            SELECT 医院名,地址,医院链, ST_AsText(geom) AS location
            FROM dg_hosip0
            ORDER BY ST_Distance(ST_AsText(geom)::geography, ST_MakePoint($1, $2))
            LIMIT 1;
        `;
        const result0 = await db.one(query0, [longitude, latitude]);
        

        // 构建返回的 JSON 数据
        const jsonResponse = {
            success: true,
            data: [
                {
                    level: '三级诊疗体',
                    医院名: result3.医院名,
                    地址: result3.地址,
                    医院链接: result3.医院链,
                },
                {
                    level: '二级诊疗体',
                    医院名: result2.医院名,
                    地址: result2.地址,
                    医院链接: result2.医院链,
                },
                // ...（其他级别的数据）
                {
                    level: '一级诊疗体',
                    医院名: result1.医院名,
                    地址: result1.地址,
                    医院链接: result1.医院链,
                },
                {
                    level: '社区诊疗体',
                    医院名: result0.医院名,
                    地址: result0.地址,
                    医院链接: result0.医院链,
                },
            ],
        };

        res.json(jsonResponse);
    } catch (error) {
        console.error('Error executing query:', error);
        // 发送 JSON 错误响应给前端
        res.status(500).json({
            success: false,
            error: '查询失败：' + error.message,
        });
    }
});



// 处理条件查询请求的路由
app.get('/newPath', (req, res) => {
    // 从请求的查询参数中获取条件
    const condition = req.query.condition;

    // 在实际应用中，这里应该有根据条件查询数据的逻辑

    // 假设这里返回一个示例数据数组
    const data = [
        { name: 'Example 1', age: 25, symptom: 'Headache' },
        { name: 'Example 2', age: 30, symptom: 'Fever' },
        // 更多数据...
    ];

    // 将数据以 JSON 格式发送回前端
    res.json(data);
});

// 启动服务器

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
