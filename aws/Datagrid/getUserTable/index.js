const mysql = require("mysql2/promise");
//TODO: Display data based on cust id
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
  const user = event.requestContext.authorizer.principalId;

  let condition;
  //Add users to cust_id here
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

  const sql = `WITH t1 AS 
  (SELECT Gateway.*, Gateway.id as gateway_id, Gateway.name as gateway_name, Device.id as device_id, Device.name as device_name 
    from Gateway 
    LEFT OUTER JOIN Device 
    ON Gateway.id = Device.gateway_id
    ${condition}),

   t2 AS
   (SELECT M.id as metric_id, M.name as metric_name, M.device_id, M.decs, M.modified, M.uom, M.created, M.profile 
    from Metric M) 

   SELECT * from t1 LEFT JOIN t2 ON t1.device_id = t2.device_id ;`;
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
