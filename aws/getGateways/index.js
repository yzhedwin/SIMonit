const mysql = require("mysql2/promise");

exports.handler = async (event, context) => {
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
  const user = event.requestContext.authorizer.principalId;

  let condition;
  switch (user?.toUpperCase()) {
    case "SPD":
      condition = "WHERE cust_id = 1";
      break;
    case "ACME":
      condition = "WHERE cust_id = 2";
      break;
    default:
      condition = "";
      break;
  }

  const sql = "SELECT Gateway.* from Gateway " + condition;
  response = await dbconn
    .execute(sql)
    .then(([rows, fields]) => {
      response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(user.toUpperCase()),
      };
      return response;
    })
    .catch((e) => {
      console.error(e);
    })
    .finally(() => dbconn.end());

  return response;
};
