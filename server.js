// server.js

const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'finalhw',
  password: 'Ry1203428',
  port: 5432,
});

// 创建查询点表，如果不存在
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS your_point_table (
    id SERIAL PRIMARY KEY,
    geom GEOMETRY(Point, 4326)
  );
`;

pool.query(createTableQuery)
  .then(() => console.log('Table created successfully'))
  .catch(err => console.error('Error creating table', err));

app.post('/query', async (req, res) => {
  try {
    const { longitude, latitude } = req.body;

    // 插入经纬度数据
    const insertQuery = `
      INSERT INTO your_point_table (geom) 
      VALUES (ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326));
    `;

    await pool.query(insertQuery);

    // 空间查询，确定点在哪个面要素上
    const spatialQuery = `
      SELECT zone_name
      FROM mta
      WHERE ST_Contains(geom, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326));
    `;

    const result = await pool.query(spatialQuery);
    const zone_name = result.rows[0]?.zone_name || 'Unknown';

    res.json({ zone_name });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
