var mysql = require("mysql2/promise");

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
  if (!params || !params.mid) {
    response = {
      statusCode: 200,
      body: JSON.stringify("Please enter valid Metric ID"),
    };
    return response;
  }
  response = await dbconn
    .execute("SELECT id, device_id as did, name from Metric where id =  ?", [
      params.mid,
    ])
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
