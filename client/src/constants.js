export const API_REFRESH_RATE = 5000;
export const DEFAULT_GRAPH_TYPE = "band";
export const DEFAULT_QUERY_1 = "memory";
export const DEFAULT_QUERY_2 = "cpu";
export const DEFAULT_QUERY_3 = "load";
export const DEFAULT_QUERY_4 = "drive";
export const DEFAULT_QUERY_5 = "uptime";
export const DEFAULT_DEVICE = "7d7836cf520e";
export const DEFAULT_CPU = "0";
export const DEFAULT_DRIVE = "/";
export const STYLE = {
  margin: "5px",
  height: "60%",
  width: "90%",
};
export const REST_URL = "http://localhost:3001"

export const FLUX_QUERY_MEMORY_BAND = (bucket, did) =>
`from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "totalmem" or r["_field"] == "memusage" or r["_field"] == "freemem")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
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

export const FLUX_QUERY_MEMORY = (bucket, did) =>
`from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "totalmem" or r["_field"] == "memusage" or r["_field"] == "freemem")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "last")`;

export const FLUX_QUERY_LOAD_BAND = (bucket, did) =>
`from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "loadavg_2" or r["_field"] == "loadavg_1" or r["_field"] == "loadavg_0")          |> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "min")

from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "loadavg_2" or r["_field"] == "loadavg_1" or r["_field"] == "loadavg_0")          |> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "mean")

from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "loadavg_2" or r["_field"] == "loadavg_1" or r["_field"] == "loadavg_0")          |> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "max")`;

export const FLUX_QUERY_LOAD = (bucket, did) =>
`from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "loadavg_2" or r["_field"] == "loadavg_1" or r["_field"] == "loadavg_0")          |> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "last")`;

export const FLUX_QUERY_CPU_BAND = (bucket, did, cpuID) =>
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

export const FLUX_QUERY_CPU = (bucket, did, cpuID) =>
`from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["cpu"] == "${cpuID}")
|> filter(fn: (r) => r["_field"] == "speed" or r["_field"] == "times_idle" or r["_field"] == "times_irq" or r["_field"] == "times_nice" or r["_field"] == "times_sys" or r["_field"] == "times_user")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "last")`;

export const FLUX_QUERY_UPTIME = (bucket, did) =>
`from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "uptime")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "last")`;

export const FLUX_QUERY_UPTIME_BAND = (bucket, did) =>
`from(bucket: "${bucket}")
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
|> yield(name: "mean")

from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["_field"] == "uptime")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "max")`;

export const FLUX_QUERY_DRIVE = (bucket, did, mount) =>
  `from(bucket: "${bucket}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${did}")
|> filter(fn: (r) => r["mount"] == "${mount}")
|> filter(fn: (r) => r["_field"] == "available" or r["_field"] == "size" or r["_field"] == "used")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "last")`;

export const FLUX_QUERY_DRIVE_BAND = (bucket, did, mount) =>
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
