const dotenv = require("dotenv/config");

// vars to connect to influxdb
exports.dashURL = process.env.DASH_INFLUX_URL;
exports.dashBucket = process.env.DASH_INFLUX_BUCKET;
exports.dashInfluxToken = process.env.DASH_INFLUX_TOKEN;
exports.dashOrgID = process.env.DASH_ORG_ID;

exports.staticURL = process.env.STATIC_INFLUX_URL;
exports.staticInfluxToken = process.env.STATIC_INFLUX_TOKEN;
exports.staticBucket = process.env.STATIC_INFLUX_BUCKET;
exports.staticOrgID = process.env.STATIC_ORG_ID;

const user = process.env.MYSQL_USER;
const pass = process.env.MYSQL_PASS;
const url = process.env.DB_URL;
const db = process.env.DB_NAME;

exports.PORT = 3001;
exports.timeout = 20000; // timeout for ping

/* Queries */
exports.FLUX_QUERY_MEMORY = (did) =>
  `from(bucket: "${this.staticBucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "totalmem" or r["_field"] == "memusage" or r["_field"] == "freemem")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "last")`;

exports.FLUX_QUERY_MEMORY_BAND = (did) =>
  `from(bucket: "${this.staticBucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "totalmem" or r["_field"] == "memusage" or r["_field"] == "freemem")
|> aggregateWindow(every: 15s, fn: mean, createEmpty: false)
|> yield(name: "mean")

from(bucket: "${this.staticBucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "totalmem" or r["_field"] == "memusage" or r["_field"] == "freemem")
|> aggregateWindow(every: 15s, fn: min, createEmpty: false)
|> yield(name: "min")

from(bucket: "${this.staticBucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "totalmem" or r["_field"] == "memusage" or r["_field"] == "freemem")
|> aggregateWindow(every: 15s, fn: max, createEmpty: false)
|> yield(name: "max")`;

exports.FLUX_QUERY_LOAD_BAND = (did) =>
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

exports.FLUX_QUERY_LOAD = (did) =>
  `from(bucket: "${this.staticBucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "loadavg_2" or r["_field"] == "loadavg_1" or r["_field"] == "loadavg_0")       
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "last")`;

exports.FLUX_QUERY_CPU_BAND = (did, cpuID) =>
  `from(bucket: "${this.staticBucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["cpu"] == "${cpuID}")
|> filter(fn: (r) => r["_field"] == "speed" or r["_field"] == "times_idle" or r["_field"] == "times_irq" or r["_field"] == "times_nice" or r["_field"] == "times_sys" or r["_field"] == "times_user")
|> aggregateWindow(every: 15s, fn: mean, createEmpty: false)
|> yield(name: "mean")

from(bucket: "${this.staticBucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["cpu"] == "${cpuID}")
|> filter(fn: (r) => r["_field"] == "speed" or r["_field"] == "times_idle" or r["_field"] == "times_irq" or r["_field"] == "times_nice" or r["_field"] == "times_sys" or r["_field"] == "times_user")
|> aggregateWindow(every: 15s, fn: min, createEmpty: false)
|> yield(name: "min")

from(bucket: "${this.staticBucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["cpu"] == "${cpuID}")
|> filter(fn: (r) => r["_field"] == "speed" or r["_field"] == "times_idle" or r["_field"] == "times_irq" or r["_field"] == "times_nice" or r["_field"] == "times_sys" or r["_field"] == "times_user")
|> aggregateWindow(every: 15s, fn: max, createEmpty: false)
|> yield(name: "max")`;

exports.FLUX_QUERY_CPU = (did, cpuID) =>
  `from(bucket: "${this.staticBucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["cpu"] == "${cpuID}")
|> filter(fn: (r) => r["_field"] == "speed" or r["_field"] == "times_idle" or r["_field"] == "times_irq" or r["_field"] == "times_nice" or r["_field"] == "times_sys" or r["_field"] == "times_user")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "last")`;

exports.FLUX_QUERY_UPTIME_BAND = (did) =>
  `from(bucket: "${this.staticBucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "uptime")
|> aggregateWindow(every: 15s, fn: mean, createEmpty: false)
|> yield(name: "mean")

from(bucket: "${this.staticBucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "uptime")
|> aggregateWindow(every: 15s, fn: min, createEmpty: false)
|> yield(name: "min")

from(bucket: "${this.staticBucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "uptime")
|> aggregateWindow(every: 15s, fn: max, createEmpty: false)
|> yield(name: "max")`;

exports.FLUX_QUERY_UPTIME = (did) =>
  `from(bucket: "${this.staticBucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "uptime")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "last")`;

exports.FLUX_QUERY_DRIVE_BAND = (did, mount) =>
  `
from(bucket: "${this.staticBucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["mount"] == "${mount}")
|> filter(fn: (r) => r["_field"] == "available" or r["_field"] == "size" or r["_field"] == "used")
|> aggregateWindow(every: 15s, fn: mean, createEmpty: false)
|> yield(name: "mean")

from(bucket: "${this.staticBucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["mount"] == "${mount}")
|> filter(fn: (r) => r["_field"] == "available" or r["_field"] == "size" or r["_field"] == "used")
|> aggregateWindow(every: 15s, fn: min, createEmpty: false)
|> yield(name: "min")

from(bucket: "${this.staticBucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["mount"] == "${mount}")
|> filter(fn: (r) => r["_field"] == "available" or r["_field"] == "size" or r["_field"] == "used")
|> aggregateWindow(every: 15s, fn: max, createEmpty: false)
|> yield(name: "max")`;

exports.FLUX_QUERY_DRIVE = (did, mount) =>
  `from(bucket: "${this.staticBucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["mount"] == "${mount}")
|> filter(fn: (r) => r["_field"] == "available" or r["_field"] == "size" or r["_field"] == "used")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "last")`;

/* Influx - MySQL */
exports.INFLUX_MYSQL_QUERY = (bucket, measurement) =>
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

exports.GET_LIST = (bucket, tag) =>
  `
  import "influxdata/influxdb/schema"
  schema.tagValues(bucket: "${bucket}", tag: "${tag}")
`;

exports.GET_TABLE = (gateway, metric) =>
  `
from(bucket: "${this.dashBucket}")
|> range(start: -5m)
|> filter(fn: (r) => r._measurement == "${gateway}")
|> filter(fn: (r) => r.name == "${metric}") 
|> aggregateWindow(every: 15s, fn: min, createEmpty: false)
|> yield(name: "min")

from(bucket: "${this.dashBucket}")
|> range(start: -5m)
|> filter(fn: (r) => r._measurement == "${gateway}")
|> filter(fn: (r) => r.name == "${metric}") 
|> aggregateWindow(every: 15s, fn: mean, createEmpty: false)
|> yield(name: "mean")

from(bucket: "${this.dashBucket}")
|> range(start: -5m)
|> filter(fn: (r) => r._measurement == "${gateway}")
|> filter(fn: (r) => r.name == "${metric}") 
|> aggregateWindow(every: 15s, fn: max, createEmpty: false)
|> yield(name: "max")
`;

exports.GET_GATEWAY_LIST = () =>
  `
import "system"
import "sql"

list = sql.from(
  driverName: "mysql",
  dataSourceName: "${user}:${pass}@tcp(${url})/${db}",
  query: "SELECT LOWER(name) as _measurement, edge_id, id as gateway_id from Gateway",
)
list`;

exports.GET_DEVICE_LIST = (gateway_id) =>
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

exports.GET_METRIC_LIST = (device) =>
  `
import "system"
import "sql"

sql.from(
  driverName: "mysql",
  dataSourceName: "${user}:${pass}@tcp(${url})/${db}",
  query: "SELECT * from Metric where device_id = ${device}",
)
`;