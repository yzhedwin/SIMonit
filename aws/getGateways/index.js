const mysql = require("mysql2/promise");

exports.handler = async (event) => {
  const dbconn = await mysql
    .createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      database: process.env.MYSQL_DB,
    })
    .catch((e) => {
      console.error(e);
      return null;
    });
  let response;
  let params = event["queryStringParameters"];
  if (!dbconn) {
    response = {
      statusCode: 400,
      body: JSON.stringify("Failed to connect"),
    };
    return response;
  }
  const sql = "SELECT Gateway.* from Gateway";
  response = await dbconn
    .execute(sql)
    .then(([rows, fields]) => {
      response = {
        statusCode: 200,
        body: JSON.stringify(rows),
      };
      return response;
    })
    .catch((e) => {
      console.error(e);
    })
    .finally(() => dbconn.end());

  return response;
};
