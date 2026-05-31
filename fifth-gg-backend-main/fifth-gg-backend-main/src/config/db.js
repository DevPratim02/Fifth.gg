const { Pool } = require("pg");
const config = require("./index");

let poolConfig = {};

if (process.env.DATABASE_URL) {
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  };
} else {
  poolConfig = {
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
  };
}

const pool = new Pool(poolConfig);

pool.on("error", (err) => {
  console.error("Unexpected PG error", err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
