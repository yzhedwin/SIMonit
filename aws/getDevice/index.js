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
/*
var mysql = require('mysql');



//exports.handler = async (event) => {
exports.handler = (event, context, callback) => {

    var requestContext = event['requestContext'];

    console.log("principalId :: " + requestContext.authorizer.principalId);
    //var params = event['queryStringParameters'];
    console.log('body *** ' + JSON.stringify(event, null, 2));
   

    //var gid = params.gid;
    //console.log('Get GID : ' + params.gid);
   // console.log("Data Check : " + params);
 
    //    console.log('GID :  ' + params.gid);
 
        var connection = mysql.createConnection({
            host:
            user:
            password:
            database:
        });


//if (event.queryStringParameters && event.queryStringParameters !== "")


        var sqlQuery ="";
//           if (params != null) {
        if (event.queryStringParameters && event.queryStringParameters !== "") {
           sqlQuery ="select name as id, description from Gateway where name = '" + event.queryStringParameters.gid + "' and cust_id = '" + requestContext.authorizer.principalId + "'";
        } else {
            sqlQuery = "select name as id, description from Gateway where cust_id = '" + requestContext.authorizer.principalId + "'";
        }
        connection.query(sqlQuery, function(error, results, fields) {
            if (error) {
                connection.destroy();
                throw error;
            }
            else {
                // connected!
                console.log("Result : " + results);

                //compose API gateway reply
                const response = {
                    statusCode: 200,
                    body: JSON.stringify(results),
                };

                //return response
                callback(error, response);

                connection.end(function(err) { callback(err, results); });
            }
        });
   

    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};

*/
