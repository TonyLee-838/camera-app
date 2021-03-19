const db = require("./db.js");

async function query(statement) {
  return new Promise((resolve) => {
    db.query(statement, (err, result) => {
      if (err) {
        console.warn(statement, ":", err);
        resolve(err);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = query;
