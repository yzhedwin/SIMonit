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
  if (!params || !params.did) {
    response = {
      statusCode: 200,
      body: JSON.stringify("Please enter valid Device ID"),
    };
    dbconn.end();
    return response;
  }
  response = await dbconn
    .execute(
      "SELECT id as did, gateway_id as gid, name from Device where id =  ?",
      [params.did]
    )
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
