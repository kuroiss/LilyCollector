// init DB
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.POSTGRES_USER_NAME,
    host: process.env.POSTGRES_HOST_NAME,
    database: process.env.POSTGRES_LILY_DB_NAME,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
});

const TABLE_NAME = 'lily_contents';

// CREATE
// NOTE : テーブル名は一旦固定する
const createTable = async () => {
    const create_query = `
        CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
            id SERIAL PRIMARY KEY,
            url TEXT NOT NULL UNIQUE,
            register_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try{
        await pool.query(create_query);
        console.log(`${TABLE_NAME} : has been created or already exists.`);
    }
    catch(err)
    {
        console.error(`Failed to create table ${TABLE_NAME}, \nerror : ${err}`);
    }
};

// INSERT
const insertData = async (url) => {
    const query = `
        INSERT INTO ${TABLE_NAME}
        (url) VALUES ($1)
        ON CONFLICT (url) DO NOTHING
        RETURNING *;`;
    try {
      const res = await pool.query(query, [url]);

      if(res.rowCount === 0)
      {
        console.log(`Skipped insert url: ${url}, this is already registered in table`);
        return null;
      }

      return res.rows[0];
    } catch (err) {
      console.error('Error inserting data:', err);
    }
};

// SELECT
// 全取得
const selectAllData = async () => {
    const query = `SELECT * FROM ${TABLE_NAME} ORDER BY id DESC;`;
    try {
        const res = await pool.query(query);
        return res.rows;
    } catch (err) {
        console.error('Error selecting data:', err);
    }
};

// 一つランダムに取得
const selectRandomData = async () => {
    try
    {
        const query = `SELECT * FROM ${TABLE_NAME} ORDER BY RANDOM() LIMIT 1`;

        const res = await pool.query(query);
        return res.rows[0];
    }
    catch(err)
    {
        console.error(`Error executing selectRandomData : ${err}`);
    }
};

// DELETE
const deleteData = async (id) => {
    const query = `DELETE FROM ${TABLE_NAME} WHERE id = $1 RETURNING *;`;
    try {
      const res = await pool.query(query, [id]);
      return res.rows[0];
    } catch (err) {
      console.error('Error deleting data:', err);
    }
};

module.exports = {
    createTable,
    insertData,
    selectAllData,
    selectRandomData,
    deleteData
};

