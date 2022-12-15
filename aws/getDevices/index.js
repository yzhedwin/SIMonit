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
 // let params = event["queryStringParameters"];
  let params = event.pathParameters;
  if (!dbconn) {
    response = {
      statusCode: 400,
      "headers": {
          'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify("Failed to connect"),
    };
    return response;
  }
  if (!params || !params.gid) {
    response = {
      statusCode: 200,
      "headers": {
          'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify("Please enter valid Gateway ID"),
    };
    dbconn.end();
    return response;
  }

  response = await dbconn
    .execute(
      "SELECT Device.* from Device where gateway_id = ?",
      [params.gid]
    )
    .then(([rows, fields]) => {
      response = {
        statusCode: 200,
        "headers": {
            'Access-Control-Allow-Origin': '*',
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
