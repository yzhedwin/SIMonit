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
  //let params = event["queryStringParameters"];
  let params = event.pathParameters;
  console.log(params.gid);
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

  if (!params || !params.gid) {
    response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify("Please enter valid Gateway ID"),
    };
    dbconn.end();
    return response;
  }

  response = await dbconn
    .execute("SELECT * from Gateway where id = ?", [params.gid])
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

/*
var mysql = require('mysql');



//exports.handler = async (event) => {
exports.handler = (event, context, callback) => {

    var requestContext = event['requestContext'];

    console.log("principalId :: " + requestContext.authorizer.principalId);
    var params = event['queryStringParameters'];
    console.log('body *** ' + JSON.stringify(event, null, 2));
   

    //var gid = params.gid;
    //console.log('Get GID : ' + params.gid);
    console.log("Data Check : " + params);
 
    //    console.log('GID :  ' + params.gid);
 
        var connection = mysql.createConnection({
            host:
            user: 
            password:
            database: 
        });

        var sqlQuery ="";
           if (params != null) {
           sqlQuery ="select name as id, description from Gateway where name = '" + params.gid + "' and cust_id = '" + requestContext.authorizer.principalId + "'";
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
