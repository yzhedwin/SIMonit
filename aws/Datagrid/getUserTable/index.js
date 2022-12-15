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
    console.error(e)
    return null;
  });
let response;
let params = event["queryStringParameters"];
if(!dbconn) {
  response = {
    statusCode: 400,
    body: JSON.stringify("Failed to connect"),
  };
  return response;
}
  const sql =
    `WITH t1 AS (SELECT Gateway.*, Gateway.id as gateway_id, Device.id as device_id from Gateway LEFT OUTER JOIN Device ON Gateway.id = Device.gateway_id WHERE Gateway.id = 1), t2 AS(SELECT M.id as metric_id, M.name, M.device_id, M.decs, M.modified, M.uom, M.created, M.profile from Metric M) SELECT * from t1 LEFT JOIN t2 ON t1.device_id = t2.device_id ;`
  response = await dbconn
    .execute(sql)
    .then(([rows, fields]) => {
      response = {
        statusCode: 200,
        body: JSON.stringify(rows),
      };
      console.log(JSON.parse(response.body))
      return response;
    })
    .catch((e) => {
      console.error(e);
    })
    .finally(() => dbconn.end());

  return response;
};
