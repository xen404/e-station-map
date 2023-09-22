const Pool = require("pg").Pool;
const pool = new Pool({
  user: "mihalkhan",
  host: "localhost",
  database: "postgres",
  password: "password",
  port: 5432,
});

module.exports = pool;
