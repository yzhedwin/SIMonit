#!/usr/bin/env node
//Rest API
const dotenv = require("dotenv/config");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { InfluxDB, flux } = require("@influxdata/influxdb-client");
const { BucketsAPI } = require("@influxdata/influxdb-client-apis");
const timeout = 20000; // timeout for ping

// vars to connect to influxdb
const dashURL = process.env.DASH_INFLUX_URL;
const dashBucket = process.env.DASH_INFLUX_BUCKET;
const dashInfluxToken = process.env.DASH_INFLUX_TOKEN;
const dashOrgID = process.env.DASH_ORG_ID;

const staticURL = process.env.STATIC_INFLUX_URL;
const staticInfluxToken = process.env.STATIC_INFLUX_TOKEN;
const staticBucket = process.env.STATIC_INFLUX_BUCKET;
const staticOrgID = process.env.STATIC_ORG_ID;

const user = process.env.MYSQL_USER;
const pass = process.env.MYSQL_PASS;
const url = process.env.DB_URL;
const db = process.env.DB_NAME;

//connections to influxdb
const dashInfluxDB = new InfluxDB({
  url: dashURL,
  token: dashInfluxToken,
  timeout: timeout,
});
const dashQueryAPI = dashInfluxDB.getQueryApi(dashOrgID);
const dashBucketsAPI = new BucketsAPI(dashInfluxDB);

const staticInfluxDB = new InfluxDB({
  url: staticURL,
  token: staticInfluxToken,
});
const staticQueryAPI = staticInfluxDB.getQueryApi(staticOrgID);
const staticBucketsAPI = new BucketsAPI(staticInfluxDB);

const dashInfluxProxy = axios.create({
  dashURL,
  headers: {
    Authorization: `Token ${dashInfluxToken}`,
    "Content-Type": "application/json",
  },
});

const staticInfluxProxy = axios.create({
  staticURL,
  headers: {
    Authorization: `Token ${staticInfluxToken}`,
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
// app.get("/influx/:bucket/:tag", (req, res) => {
//   const { tag, bucket } = req.params;
//   let list = [];
//   let fluxQuery = flux`` + GET_LIST(bucket, tag);
//   staticQueryAPI.queryRows(fluxQuery, {
//     next(row, tableMeta) {
//       const o = tableMeta.toObject(row);
//       list.push(o._value);
//     },
//     error(error) {
//       console.error(error);
//       console.log("\nFinished ERROR");
//     },
//     complete() {
//       console.log("\nFinished SUCCESS");
//       res.end(JSON.stringify({ list }));
//     },
//   });
// });

app.get("/drive/:did", (req, res) => {
  const { did } = req.params;
  const mount = req.query.mount;
  let csv = "";
  let fluxQuery = flux`` + FLUX_QUERY_DRIVE(staticBucket, did, mount);
  staticQueryAPI.queryLines(fluxQuery, {
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
  const mount = req.query.mount;
  let csv = "";
  let fluxQuery = flux`` + FLUX_QUERY_DRIVE_BAND(staticBucket, did, mount);
  staticQueryAPI.queryLines(fluxQuery, {
    next(line) {
      csv = `${csv}${line}\n`;
    },
    error(error) {
      console.error(error);
      console.log("\nFinished " + did + mount + " drive band Error");
      res.end();
    },
    complete() {
      console.log("\nFinished " + did + mount + " drive band SUCCESS");
      res.end(JSON.stringify({ csv }));
    },
  });
});

app.get("/memory/:did", (req, res) => {
  const { did } = req.params;
  let csv = "";
  let fluxQuery = flux`` + FLUX_QUERY_MEMORY(staticBucket, did);
  staticQueryAPI.queryLines(fluxQuery, {
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
  let fluxQuery = flux`` + FLUX_QUERY_MEMORY_BAND(staticBucket, did);
  staticQueryAPI.queryLines(fluxQuery, {
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
  let fluxQuery = flux`` + FLUX_QUERY_LOAD(staticBucket, did);
  staticQueryAPI.queryLines(fluxQuery, {
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
  let fluxQuery = flux`` + FLUX_QUERY_LOAD_BAND(staticBucket, did);
  staticQueryAPI.queryLines(fluxQuery, {
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
  let fluxQuery = flux`` + FLUX_QUERY_CPU(staticBucket, did, cpuID);
  staticQueryAPI.queryLines(fluxQuery, {
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
  let fluxQuery = flux`` + FLUX_QUERY_CPU_BAND(staticBucket, did, cpuID);
  staticQueryAPI.queryLines(fluxQuery, {
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
  let fluxQuery = flux`` + FLUX_QUERY_UPTIME(staticBucket, did);
  staticQueryAPI.queryLines(fluxQuery, {
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
  let fluxQuery = flux`` + FLUX_QUERY_UPTIME_BAND(staticBucket, did);
  staticQueryAPI.queryLines(fluxQuery, {
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
  const { bucket, measurement } = req.params;
  let csv = "";
  let fluxQuery = flux`` + INFLUX_MYSQL_QUERY(bucket, measurement);
  dashQueryAPI.queryLines(fluxQuery, {
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
app.get("/gatewaylist", (req, res) => {
  let list = [];
  let fluxQuery = flux`` + GET_GATEWAY_LIST();
  dashQueryAPI.queryRows(fluxQuery, {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row);
      list.push({
        id: o.gateway_id,
        edge_id: o.edge_id,
        _measurement: o._measurement,
      });
    },
    error(error) {
      console.error(error);
      console.log("\nFinished fetching gatewaylist ERROR");
    },
    complete() {
      console.log("\nFinished fetching gatewaylist SUCCESS");
      res.end(JSON.stringify({ list }));
    },
  });
});
app.get("/devicelist/:gateway/", (req, res) => {
  const { gateway } = req.params;
  let list = [];
  let fluxQuery = flux`` + GET_DEVICE_LIST(gateway);
  dashQueryAPI.queryRows(fluxQuery, {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row);
      list.push({ gateway_id: o.gateway_id, id: o.device_id, name: o.name });
    },
    error(error) {
      console.error(error);
      console.log("\nFinished fetching devicelist ERROR");
    },
    complete() {
      console.log("\nFinished fetching devicelist  SUCCESS");
      res.end(JSON.stringify({ list }));
    },
  });
});
app.get("/metriclist/:device", (req, res) => {
  const { device } = req.params;
  let list = [];
  let fluxQuery = flux`` + GET_METRIC_LIST(device);
  dashQueryAPI.queryRows(fluxQuery, {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row);
      list.push({ id: o.id, device_id: o.device_id, name: o.name });
    },
    error(error) {
      console.error(error);
      console.log("\nFinished fetching mettriclist ERROR");
    },
    complete() {
      console.log("\nFinished fetching mettriclist SUCCESS");
      res.end(JSON.stringify({ list }));
    },
  });
});

app.get("/table/:gateway/:metric", (req, res) => {
  const { gateway, metric } = req.params;
  let csv = "";
  let fluxQuery = flux`` + GET_TABLE(gateway, metric);
  dashQueryAPI.queryLines(fluxQuery, {
    next(line) {
      csv = `${csv}${line}\n`;
    },
    error(error) {
      console.error(error);
      console.log(`\nFinished fetching ${gateway} ERROR`);
      res.end();
    },
    complete() {
      console.log(`\nFinished fetching ${gateway} SUCCESS`);
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
  return await staticBucketsAPI.getBuckets({ staticOrgID });
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
|> aggregateWindow(every: 15s, fn: mean, createEmpty: false)
|> yield(name: "mean")

from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "totalmem" or r["_field"] == "memusage" or r["_field"] == "freemem")
|> aggregateWindow(every: 15s, fn: min, createEmpty: false)
|> yield(name: "min")

from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "totalmem" or r["_field"] == "memusage" or r["_field"] == "freemem")
|> aggregateWindow(every: 15s, fn: max, createEmpty: false)
|> yield(name: "max")`;

const FLUX_QUERY_LOAD_BAND = (bucket, did) =>
  `from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "loadavg_2" or r["_field"] == "loadavg_1" or r["_field"] == "loadavg_0")
|> aggregateWindow(every: 15s, fn: mean, createEmpty: false)
|> yield(name: "mean")

from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "loadavg_2" or r["_field"] == "loadavg_1" or r["_field"] == "loadavg_0")
|> aggregateWindow(every: 15s, fn: min, createEmpty: false)
|> yield(name: "min")

from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "loadavg_2" or r["_field"] == "loadavg_1" or r["_field"] == "loadavg_0")
|> aggregateWindow(every: 15s, fn: max, createEmpty: false)
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
|> aggregateWindow(every: 15s, fn: mean, createEmpty: false)
|> yield(name: "mean")

from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["cpu"] == "${cpuID}")
|> filter(fn: (r) => r["_field"] == "speed" or r["_field"] == "times_idle" or r["_field"] == "times_irq" or r["_field"] == "times_nice" or r["_field"] == "times_sys" or r["_field"] == "times_user")
|> aggregateWindow(every: 15s, fn: min, createEmpty: false)
|> yield(name: "min")

from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["cpu"] == "${cpuID}")
|> filter(fn: (r) => r["_field"] == "speed" or r["_field"] == "times_idle" or r["_field"] == "times_irq" or r["_field"] == "times_nice" or r["_field"] == "times_sys" or r["_field"] == "times_user")
|> aggregateWindow(every: 15s, fn: max, createEmpty: false)
|> yield(name: "max")`;

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
|> aggregateWindow(every: 15s, fn: mean, createEmpty: false)
|> yield(name: "mean")

from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "uptime")
|> aggregateWindow(every: 15s, fn: min, createEmpty: false)
|> yield(name: "min")

from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "uptime")
|> aggregateWindow(every: 15s, fn: max, createEmpty: false)
|> yield(name: "max")`;

const FLUX_QUERY_UPTIME = (bucket, did) =>
  `from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "uptime")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "last")`;

const FLUX_QUERY_DRIVE_BAND = (bucket, did, mount) =>
  `
from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["mount"] == "${mount}")
|> filter(fn: (r) => r["_field"] == "available" or r["_field"] == "size" or r["_field"] == "used")
|> aggregateWindow(every: 15s, fn: mean, createEmpty: false)
|> yield(name: "mean")

from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["mount"] == "${mount}")
|> filter(fn: (r) => r["_field"] == "available" or r["_field"] == "size" or r["_field"] == "used")
|> aggregateWindow(every: 15s, fn: min, createEmpty: false)
|> yield(name: "min")

from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["mount"] == "${mount}")
|> filter(fn: (r) => r["_field"] == "available" or r["_field"] == "size" or r["_field"] == "used")
|> aggregateWindow(every: 15s, fn: max, createEmpty: false)
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

const GET_LIST = (bucket, tag) =>
  `
  import "influxdata/influxdb/schema"
  schema.tagValues(bucket: "${bucket}", tag: "${tag}")
`;

const GET_TABLE = (gateway, metric) =>
  `
from(bucket: "${dashBucket}")
|> range(start: -5m)
|> filter(fn: (r) => r._measurement == "${gateway}")
|> filter(fn: (r) => r.name == "${metric}") 
|> aggregateWindow(every: 15s, fn: min, createEmpty: false)
|> yield(name: "min")

from(bucket: "${dashBucket}")
|> range(start: -5m)
|> filter(fn: (r) => r._measurement == "${gateway}")
|> filter(fn: (r) => r.name == "${metric}") 
|> aggregateWindow(every: 15s, fn: mean, createEmpty: false)
|> yield(name: "mean")

from(bucket: "${dashBucket}")
|> range(start: -5m)
|> filter(fn: (r) => r._measurement == "${gateway}")
|> filter(fn: (r) => r.name == "${metric}") 
|> aggregateWindow(every: 15s, fn: max, createEmpty: false)
|> yield(name: "max")
`;

const GET_GATEWAY_LIST = () =>
  `
import "system"
import "sql"

list = sql.from(
  driverName: "mysql",
  dataSourceName: "${user}:${pass}@tcp(${url})/${db}",
  query: "SELECT LOWER(name) as _measurement, edge_id, id as gateway_id from Gateway",
)
list`;

const GET_DEVICE_LIST = (gateway_id) =>
  `
import "system"
import "sql"

b = sql.from(
  driverName: "mysql",
  dataSourceName: "${user}:${pass}@tcp(${url})/${db}",
  query: "SELECT id as device_id, gateway_id, name from Device where gateway_id = '${gateway_id}'",
)
b
`;

const GET_METRIC_LIST = (device) =>
  `
import "system"
import "sql"

sql.from(
  driverName: "mysql",
  dataSourceName: "${user}:${pass}@tcp(${url})/${db}",
  query: "SELECT * from Metric where device_id = ${device}",
)
`;
