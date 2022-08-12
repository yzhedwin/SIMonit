#!/usr/bin/env node
//Rest API
const dotenv = require('dotenv/config');
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { InfluxDB, flux } = require("@influxdata/influxdb-client");
const { BucketsAPI } = require("@influxdata/influxdb-client-apis");

// vars to connect to bucket in influxdb
const baseURL = process.env.INFLUX_URL;
const influxToken = process.env.INFLUX_TOKEN;
const orgID = process.env.ORG_ID; 
const bucket = process.env.BUCKET_NAME;
const user = process.env.MYSQL_USER;
const pass = process.env.MYSQL_PASS;
const url = process.env.DB_URL;
const db = process.env.DB_NAME;

// connect to influxdb
const influxDB = new InfluxDB({ url: baseURL, token: influxToken });
const queryApi = influxDB.getQueryApi(orgID);
const bucketsAPI = new BucketsAPI(influxDB);

const influxProxy = axios.create({
  baseURL,
  headers: {
    Authorization: `Token ${influxToken}`,
    "Content-Type": "application/json",
  },
});

// start the server
const app = express();
app.use(cors());
const port = 3001;

// get available buckets
app.get("/buckets", (req, res) => {
  getBuckets().then((b) => res.end(JSON.stringify(b)));
});

app.get("/drive/:did", (req, res) => {
  const { did } = req.params;
  let csv = "";
  let clientNodeRed = flux`` + FLUX_QUERY_DRIVE(bucket, did, "/");
  queryApi.queryLines(clientNodeRed, {
    next(line) {
      csv = `${csv}${line}\n`;
    },
    error(error) {
      console.error(error);
      console.log("\nFinished " + did + " drive ERROR");
      res.end();
    },
    complete() {
      console.log("\nFinished " + did + " drive SUCCESS");
      res.end(JSON.stringify({ csv }));
    },
  });
});

app.get("/drive-band/:did", (req, res) => {
  const { did } = req.params;
  let csv = "";
  let clientNodeRed = flux`` + FLUX_QUERY_DRIVE_BAND(bucket, did, "/");
  queryApi.queryLines(clientNodeRed, {
    next(line) {
      csv = `${csv}${line}\n`;
    },
    error(error) {
      console.error(error);
      console.log("\nFinished " + did + " drive ERROR");
      res.end();
    },
    complete() {
      console.log("\nFinished " + did + " drive SUCCESS");
      res.end(JSON.stringify({ csv }));
    },
  });
});

app.get("/memory/:did", (req, res) => {
  const { did } = req.params;
  let csv = "";
  let clientNodeRed = flux`` + FLUX_QUERY_MEMORY(bucket, did);
  queryApi.queryLines(clientNodeRed, {
    next(line) {
      csv = `${csv}${line}\n`;
    },
    error(error) {
      console.error(error);
      console.log("\nFinished " + did + " memory ERROR");
      res.end();
    },
    complete() {
      console.log("\nFinished " + did + " memory SUCCESS");
      res.end(JSON.stringify({ csv }));
    },
  });
});
app.get("/memory-band/:did", (req, res) => {
  const { did } = req.params;
  let csv = "";
  let clientNodeRed = flux`` + FLUX_QUERY_MEMORY_BAND(bucket, did);
  queryApi.queryLines(clientNodeRed, {
    next(line) {
      csv = `${csv}${line}\n`;
    },
    error(error) {
      console.error(error);
      console.log("\nFinished " + did + " memory_band ERROR");
      res.end();
    },
    complete() {
      console.log("\nFinished " + did + " memory_band SUCCESS");
      res.end(JSON.stringify({ csv }));
    },
  });
});
app.get("/load/:did", (req, res) => {
  const { did } = req.params;
  let csv = "";
  let clientNodeRed = flux`` + FLUX_QUERY_LOAD(bucket, did);
  queryApi.queryLines(clientNodeRed, {
    next(line) {
      csv = `${csv}${line}\n`;
    },
    error(error) {
      console.error(error);
      console.log("\nFinished " + did + " load ERROR");
      res.end();
    },
    complete() {
      console.log("\nFinished " + did + " load SUCCESS");
      res.end(JSON.stringify({ csv }));
    },
  });
});

app.get("/load-band/:did", (req, res) => {
  const { did } = req.params;
  let csv = "";
  let clientNodeRed = flux`` + FLUX_QUERY_LOAD_BAND(bucket, did);
  queryApi.queryLines(clientNodeRed, {
    next(line) {
      csv = `${csv}${line}\n`;
    },
    error(error) {
      console.error(error);
      console.log("\nFinished " + did + " load ERROR");
      res.end();
    },
    complete() {
      console.log("\nFinished " + did + " load SUCCESS");
      res.end(JSON.stringify({ csv }));
    },
  });
});

app.get("/cpu/:did/:cpuID", (req, res) => {
  const { did, cpuID } = req.params;
  let csv = "";
  let clientNodeRed = flux`` + FLUX_QUERY_CPU(bucket, did, cpuID);
  queryApi.queryLines(clientNodeRed, {
    next(line) {
      csv = `${csv}${line}\n`;
    },
    error(error) {
      console.error(error);
      console.log("\nFinished " + did + " " + cpuID + " CPU ERROR");
      res.end();
    },
    complete() {
      console.log("\nFinished " + did + " " + cpuID + " CPU SUCCESS");
      res.end(JSON.stringify({ csv }));
    },
  });
});
app.get("/cpu-band/:did/:cpuID", (req, res) => {
  const { did, cpuID } = req.params;
  let csv = "";
  let clientNodeRed = flux`` + FLUX_QUERY_CPU_BAND(bucket, did, cpuID);
  queryApi.queryLines(clientNodeRed, {
    next(line) {
      csv = `${csv}${line}\n`;
    },
    error(error) {
      console.error(error);
      console.log("\nFinished " + did + " " + cpuID + " CPU ERROR");
      res.end();
    },
    complete() {
      console.log("\nFinished " + did + " " + cpuID + " CPU SUCCESS");
      res.end(JSON.stringify({ csv }));
    },
  });
});

app.get("/uptime/:did/", (req, res) => {
  const { did } = req.params;
  let csv = "";
  let clientNodeRed = flux`` + FLUX_QUERY_UPTIME(bucket, did);
  queryApi.queryLines(clientNodeRed, {
    next(line) {
      csv = `${csv}${line}\n`;
    },
    error(error) {
      console.error(error);
      console.log("\nFinished " + did + " uptime ERROR");
      res.end();
    },
    complete() {
      console.log("\nFinished " + did + " uptime SUCCESS");
      res.end(JSON.stringify({ csv }));
    },
  });
});

app.get("/uptime-band/:did/", (req, res) => {
  const { did } = req.params;
  let csv = "";
  let clientNodeRed = flux`` + FLUX_QUERY_UPTIME_BAND(bucket, did);
  queryApi.queryLines(clientNodeRed, {
    next(line) {
      csv = `${csv}${line}\n`;
    },
    error(error) {
      console.error(error);
      console.log("\nFinished " + did + " uptime ERROR");
      res.end();
    },
    complete() {
      console.log("\nFinished " + did + " uptime SUCCESS");
      res.end(JSON.stringify({ csv }));
    },
  });
});

app.get("/influxsql/:bucket/:measurement", (req, res) => {
  const { bucket, measurement } = req.params
  let csv = "";
  let clientNodeRed = flux`` + INFLUX_MYSQL_QUERY(bucket, measurement);
  queryApi.queryLines(clientNodeRed, {
      next(line) {
          csv = `${csv}${line}\n`;
      },
      error(error) {
          console.error(error);
          console.log("\nFinished influxsql query with error");
          res.end();
      },
      complete() {
          console.log("\nFinished influxsql query with SUCCESS");
          res.end(JSON.stringify({ csv }));
      },
  });
});

// app.get('/uptime/:did', (req, res) => {
//   const { did } = req.params;
//   let apiQuery = flux`` + FLUX_QUERY_UPTIME(bucket, did);
//   console.log(apiQuery)
//   influxProxy.request({
//     method: 'post',
//     url: 'api/v2/query',
//     params: {
//       orgID
//     },
//     data: {
//       query: apiQuery,
//       extern: {"type":"File","package":null,"imports":null,"body":[{"type":"OptionStatement","assignment":{"type":"VariableAssignment","id":{"type":"Identifier","name":"v"},"init":{"type":"ObjectExpression","properties":[{"type":"Property","key":{"type":"Identifier","name":"bucket"},"value":{"type":"StringLiteral","value":"telegraf"}},{"type":"Property","key":{"type":"Identifier","name":"timeRangeStart"},"value":{"type":"UnaryExpression","operator":"-","argument":{"type":"DurationLiteral","values":[{"magnitude":1,"unit":"h"}]}}},{"type":"Property","key":{"type":"Identifier","name":"timeRangeStop"},"value":{"type":"CallExpression","callee":{"type":"Identifier","name":"now"}}},{"type":"Property","key":{"type":"Identifier","name":"windowPeriod"},"value":{"type":"DurationLiteral","values":[{"magnitude":10000,"unit":"ms"}]}}]}}}]},
//       dialect :{"annotations":["group","datatype","default"]}
//     }
//   }).then((response) => {
//     console.log('\nFinished /cpu/api SUCCESS')
//     res.send(JSON.stringify({csv: response.data}))
//   }).catch(error => {
//     console.log(error)
//     console.log('\nFinished /cpu/api ERROR')
//     res.send(error.message)
//   });
//  })

app.listen(port, () => {
  console.log(`listening on port :${port}`);
});

async function getBuckets() {
  return await bucketsAPI.getBuckets({ orgID });
}

/* Queries */
const FLUX_QUERY_MEMORY = (bucket, did) =>
  `from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "totalmem" or r["_field"] == "memusage" or r["_field"] == "freemem")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "last")`;

const FLUX_QUERY_MEMORY_BAND = (bucket, did) =>
  `from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "totalmem" or r["_field"] == "memusage" or r["_field"] == "freemem")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "max")

from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "totalmem" or r["_field"] == "memusage" or r["_field"] == "freemem")
|> aggregateWindow(every: 15s, fn: min, createEmpty: false)
|> yield(name: "mean")

from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "totalmem" or r["_field"] == "memusage" or r["_field"] == "freemem")
|> aggregateWindow(every: 15s, fn: max, createEmpty: false)
|> yield(name: "min")`;

const FLUX_QUERY_LOAD_BAND = (bucket, did) =>
  `from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "loadavg_2" or r["_field"] == "loadavg_1" or r["_field"] == "loadavg_0")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "min")

from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "loadavg_2" or r["_field"] == "loadavg_1" or r["_field"] == "loadavg_0")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "mean")

from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "loadavg_2" or r["_field"] == "loadavg_1" or r["_field"] == "loadavg_0")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "max")`;

const FLUX_QUERY_LOAD = (bucket, did) =>
  `from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "loadavg_2" or r["_field"] == "loadavg_1" or r["_field"] == "loadavg_0")       
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "last")`;

const FLUX_QUERY_CPU_BAND = (bucket, did, cpuID) =>
  `from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["cpu"] == "${cpuID}")
|> filter(fn: (r) => r["_field"] == "speed" or r["_field"] == "times_idle" or r["_field"] == "times_irq" or r["_field"] == "times_nice" or r["_field"] == "times_sys" or r["_field"] == "times_user")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "mean")

from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["cpu"] == "${cpuID}")
|> filter(fn: (r) => r["_field"] == "speed" or r["_field"] == "times_idle" or r["_field"] == "times_irq" or r["_field"] == "times_nice" or r["_field"] == "times_sys" or r["_field"] == "times_user")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "max")

from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["cpu"] == "${cpuID}")
|> filter(fn: (r) => r["_field"] == "speed" or r["_field"] == "times_idle" or r["_field"] == "times_irq" or r["_field"] == "times_nice" or r["_field"] == "times_sys" or r["_field"] == "times_user")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "min")`;

const FLUX_QUERY_CPU = (bucket, did, cpuID) =>
  `from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["cpu"] == "${cpuID}")
|> filter(fn: (r) => r["_field"] == "speed" or r["_field"] == "times_idle" or r["_field"] == "times_irq" or r["_field"] == "times_nice" or r["_field"] == "times_sys" or r["_field"] == "times_user")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "last")`;

const FLUX_QUERY_UPTIME_BAND = (bucket, did) =>
  `from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "uptime")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "max")

from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "uptime")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "min")

from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "uptime")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "mean")`;

const FLUX_QUERY_UPTIME = (bucket, did) =>
  `from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "uptime")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "last")`;

const FLUX_QUERY_DRIVE_BAND = (bucket, did, mount) =>
  `from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["mount"] == "${mount}")
|> filter(fn: (r) => r["_field"] == "available" or r["_field"] == "size" or r["_field"] == "used")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "min")
from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["mount"] == "${mount}")
|> filter(fn: (r) => r["_field"] == "available" or r["_field"] == "size" or r["_field"] == "used")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "mean")
from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["mount"] == "${mount}")
|> filter(fn: (r) => r["_field"] == "available" or r["_field"] == "size" or r["_field"] == "used")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "max")`;

const FLUX_QUERY_DRIVE = (bucket, did, mount) =>
  `from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["mount"] == "${mount}")
|> filter(fn: (r) => r["_field"] == "available" or r["_field"] == "size" or r["_field"] == "used")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "last")`;

/* Influx - MySQL */
const INFLUX_MYSQL_QUERY = (bucket, measurement) =>
`
import "system"
import "influxdata/influxdb/secrets"
import "sql"


gateway = sql.from(
     driverName: "mysql",
     dataSourceName: "${user}:${pass}@tcp(${url})/${db}",
     query: "SELECT id as gateway_id from Gateway",
)
device = sql.from(
     driverName: "mysql",
     dataSourceName: "${user}:${pass}@tcp(${url})/${db}",
     query: "SELECT id as device_id, gateway_id from Device",
)
metric = sql.from(
     driverName: "mysql",
     dataSourceName: "${user}:${pass}@tcp(${url})/${db}",
     query: "SELECT id as metric_id, device_id, uom from Metric",
)
a = join(tables: {key1: gateway, key2: device}, on: ["gateway_id"], method: "inner")
b = join(tables: {key1: metric, key2: a}, on: ["device_id"], method: "inner")
|> map(fn: (r) => ({ r with uom: string(v: r.uom), device_id: string(v: r.device_id), gateway_id: string(v: r.gateway_id), metric_id: string(v: r.metric_id) }))

c = from(bucket: "${bucket}")
|> range(start: -30d)
|> filter(fn: (r) => r["_measurement"] == "${measurement}")
|> group()

out = join(tables: {key1: b, key2: c}, on: ["device_id", "metric_id", "gateway_id"], method: "inner")
out`;
