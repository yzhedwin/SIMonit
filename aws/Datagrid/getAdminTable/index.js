const mysql = require("mysql2/promise");

const tableList = { gateway: "Gateway", metric: "Metric", device: "Device" };

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
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify("Failed to connect"),
    };
    return response;
  }
  if (!tableList[params.table.toLowerCase()]) {
    response = {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify("Table does not exist"),
    };
    return response;
  }
  const sql = `SELECT * from ${tableList[params.table.toLowerCase()]};`;
  response = await dbconn
    .execute(sql)
    .then(([rows, fields]) => {
      response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(rows),
      };
      console.log(JSON.parse(response.body));
      return response;
    })
    .catch((e) => {
      console.error(e);
    })
    .finally(() => dbconn.end());

  return response;
};
