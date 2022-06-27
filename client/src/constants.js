export const REASONABLE_API_REFRESH_RATE = 5000;
export const DEFAULT_GRAPH_TYPE = "band";
export const DEFAULT_QUERY1 = "memory";
export const DEFAULT_QUERY2 = "eth";
export const DEFAULT_QUERY3 = "uptime";
export const DEFAULT_DEVICE = "7d7836cf520e";
export const STYLE = {
  margin: "5px",
  height: "60%",
  width: "90%",
};

export const FLUX_QUERY_MEMORY = (bucket, did) =>
  `from(bucket: "${bucket}")
    |> range(start: -60m)
    |> filter(fn: (r) => r["_measurement"] == "${did}")
    |> filter(fn: (r) => r["_field"] == "mem_free" or r["_field"] == "mem_swapfree" or r["_field"] == "mem_used" or r["_field"] == "mem_swapused")
    |> aggregateWindow(every: 15s, fn: last, createEmpty: false)
    |> yield(name: "mean")
      
      from(bucket: "${bucket}")
    |> range(start: -60m)
    |> filter(fn: (r) => r["_measurement"] == "${did}")
    |> filter(fn: (r) => r["_field"] == "mem_free" or r["_field"] == "mem_swapfree" or r["_field"] == "mem_used" or r["_field"] == "mem_swapused")
    |> aggregateWindow(every: 15s, fn: min, createEmpty: false)
    |> yield(name: "min")
    
    from(bucket: "${bucket}")
    |> range(start: -60m)
    |> filter(fn: (r) => r["_measurement"] == "${did}")
    |> filter(fn: (r) => r["_field"] == "mem_free" or r["_field"] == "mem_swapfree" or r["_field"] == "mem_used" or r["_field"] == "mem_swapused")
    |> aggregateWindow(every: 15s, fn: max, createEmpty: false)
    |> yield(name: "max")`;

export const FLUX_QUERY_ETH = (bucket, did) =>
  `from(bucket: "${bucket}")
      |> range(start: -60m)
      |> filter(fn: (r) => r["_measurement"] == "${did}")
      |> filter(fn: (r) => r["_field"] == "nw_eth0_rx" or r["_field"] == "nw_eth0_tx")
      |> aggregateWindow(every: 15s, fn: last, createEmpty: false)
      |> yield(name: "last")`;
export const FLUX_QUERY_ETH_BAND = (bucket, did) =>
  `from(bucket: "${bucket}")
          |> range(start: -60m)
          |> filter(fn: (r) => r["_measurement"] == "${did}")
          |> filter(fn: (r) => r["_field"] == "nw_eth0_rx" or r["_field"] == "nw_eth0_tx")
          |> aggregateWindow(every: 15s, fn: last, createEmpty: false)
          |> yield(name: "min")
          from(bucket: "${bucket}")
          |> range(start: -60m)
          |> filter(fn: (r) => r["_measurement"] == "${did}")
          |> filter(fn: (r) => r["_field"] == "nw_eth0_rx" or r["_field"] == "nw_eth0_tx")
          |> aggregateWindow(every: 15s, fn: last, createEmpty: false)
          |> yield(name: "mean")
          from(bucket: "${bucket}")
          |> range(start: -60m)
          |> filter(fn: (r) => r["_measurement"] == "${did}")
          |> filter(fn: (r) => r["_field"] == "nw_eth0_rx" or r["_field"] == "nw_eth0_tx")
          |> aggregateWindow(every: 15s, fn: last, createEmpty: false)
          |> yield(name: "max")`;

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
