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

async function iterateLines(dbQueryAPI, fluxQuery) {
  let csv = "";
  const data = await dbQueryAPI.collectLines(fluxQuery);
  data.forEach((line) => {
    csv = `${csv}${line}\n`;
  });
  return { csv };
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
  //let params = event.pathParameters;
  //check connection to db
  if (!dbClient) {
    response = {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify("Failed to connect"),
    };
    return response;
  }
  //check params
  if (!params) {
    response = {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(
        "Missing parameters gateway name or metric name. Please check that parameters are keyed in!"
      ),
    };
    return response;
  }
  if (!params.metric) {
    response = {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(
        "Missing parameters metric name. Please check that parameters are keyed in!"
      ),
    };
    return response;
  }
  if (!params.gateway) {
    response = {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(
        "Missing parameters gateway name. Please check that parameters are keyed in!"
      ),
    };
    return response;
  }
  let fluxQuery =
    flux`` +
    GET_TABLE(params.gateway, params.metric, process.env.INFLUX_BUCKET);
  //fetch data
  const csv = await iterateLines(dbQueryAPI, fluxQuery).catch((error) =>
    console.error("CollectRows ERROR", error)
  );
  response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(csv),
  };
  return response;
};
