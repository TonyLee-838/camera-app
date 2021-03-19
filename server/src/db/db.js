const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "camera",
  port: 3306,
});

db.connect((err) => {
  if (err) throw err;
  console.log("数据库连接成功");
});

module.exports = db;
