"use strict";

const { InfluxDB, flux } = require("@influxdata/influxdb-client");

const GET_TABLE = (gateway, metric, bucket) =>
  `
from(bucket: "${bucket}")
|> range(start: -5m)
|> filter(fn: (r) => r._measurement == "${gateway}")
|> filter(fn: (r) => r.name == "${metric}") 
|> aggregateWindow(every: 15s, fn: min, createEmpty: false)
|> yield(name: "min")

from(bucket: "${bucket}")
|> range(start: -5m)
|> filter(fn: (r) => r._measurement == "${gateway}")
|> filter(fn: (r) => r.name == "${metric}") 
|> aggregateWindow(every: 15s, fn: mean, createEmpty: false)
|> yield(name: "mean")

from(bucket: "${bucket}")
|> range(start: -5m)
|> filter(fn: (r) => r._measurement == "${gateway}")
|> filter(fn: (r) => r.name == "${metric}") 
|> aggregateWindow(every: 15s, fn: max, createEmpty: false)
|> yield(name: "max")
`;

// Execute query and collect result rows in a Promise.
// Use with caution, it copies the whole stream of results into memory.
async function collectRows(dbQueryAPI, gateway, metric) {
  let fluxQuery =
    flux`` + GET_TABLE(gateway, metric, process.env.INFLUX_BUCKET);
  const data = await dbQueryAPI.collectRows(
    fluxQuery //, you can also specify a row mapper as a second argument
  );
  console.log("\nCollect ROWS SUCCESS");
  return data;
}

exports.handler = async (event) => {
  //connections to influxdb
  const dbClient = new InfluxDB({
    url: process.env.INFLUX_HOST,
    token: process.env.INFLUX_TOKEN,
  });
  const dbQueryAPI = dbClient.getQueryApi(process.env.INFLUX_ORGID);

  let response;
  let params = event["queryStringParameters"];
  //check connection to db
  if (!dbClient) {
    response = {
      statusCode: 400,
      body: JSON.stringify("Failed to connect"),
    };
    return response;
  }
  //check params
  if (!params || !params.metric || !params.gateway) {
    response = {
      statusCode: 200,
      body: JSON.stringify(
        "Missing parameters gid or mid. Please check that parameters are keyed in!"
      ),
    };
    return response;
  }

  //fetch data
  const rows = await collectRows(dbQueryAPI, params.gateway, params.metric).catch((error) =>
    console.error("CollectRows ERROR", error)
  );
  response = {
    statusCode: 200,
    body: JSON.stringify(rows),
  };
  return response;
};
