const mysql = require("mysql2/promise");

const tableList = { gateway: "Gateway", metric: "Metric", device: "Device" };
exports.handler = async (event) => {
  console.log(tableList[event.table.toLowerCase()]);
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
  if (!event || !event.id || !event.table || !event.field) {
    response = {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify("Missing parameters!"),
    };
    return response;
  }
  if (!event.newVal) {
    event.newVal = "";
  }
  if (!tableList[event.table.toLowerCase()]) {
    response = {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify("Table does not exist"),
    };
    return response;
  }
  const sql = `UPDATE ${tableList[event.table.toLowerCase()]} SET ${
    event.field
  } = '${event.newVal}' WHERE id = ${event.id}`;
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
      return response;
    })
    .catch((e) => {
      console.error(e);
    })
    .finally(() => dbconn.end());

  return response;
};
