import React, { useEffect, useState } from "react";
import { fromFlux, Plot } from "@influxdata/giraffe";
import { findStringColumns } from "../helpers";
import LayerConfig from "../config/configuration/LayerConfig";
import DataFormatter from "../config/configuration/DataFormatter";
import { REASONABLE_API_REFRESH_RATE, STYLE } from "../constants";
import {
  INFLUXDB_BUCKET,
  QUERY_API,
} from "../config/configuration/InfluxDBConfig";
const { flux } = require("@influxdata/influxdb-client");

let animationFrameId = 0;
export default function StaticGraph({
  id,
  device,
  graphType,
  query,
  toggleLegend,
}) {
  const [table, setTable] = useState({
    data: {},
    lastUpdated: "",
  });
  const queryMemory = `from(bucket: "${INFLUXDB_BUCKET}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${device}")
|> filter(fn: (r) => r["_field"] == "mem_free" or r["_field"] == "mem_swapfree" or r["_field"] == "mem_used" or r["_field"] == "mem_swapused")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "mean")
  
  from(bucket: "${INFLUXDB_BUCKET}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${device}")
|> filter(fn: (r) => r["_field"] == "mem_free" or r["_field"] == "mem_swapfree" or r["_field"] == "mem_used" or r["_field"] == "mem_swapused")
|> aggregateWindow(every: 15s, fn: min, createEmpty: false)
|> yield(name: "min")

from(bucket: "${INFLUXDB_BUCKET}")
|> range(start: -60m)
|> filter(fn: (r) => r["_measurement"] == "${device}")
|> filter(fn: (r) => r["_field"] == "mem_free" or r["_field"] == "mem_swapfree" or r["_field"] == "mem_used" or r["_field"] == "mem_swapused")
|> aggregateWindow(every: 15s, fn: max, createEmpty: false)
|> yield(name: "max")`;

  const queryETH = `from(bucket: "${INFLUXDB_BUCKET}")
  |> range(start: -60m)
  |> filter(fn: (r) => r["_measurement"] == "${device}")
  |> filter(fn: (r) => r["_field"] == "nw_eth0_rx" or r["_field"] == "nw_eth0_tx")|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
  |> yield(name: "last")`;

  const queryUptime = `from(bucket: "${INFLUXDB_BUCKET}")
|> range(start: -60m)
  |> filter(fn: (r) => r["_measurement"] == "${device}")
  |> filter(fn: (r) => r["_field"] == "uptime")|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
  |> yield(name: "last")`;

  const getDataAndUpdateTable = async () => {
    let csv = "";
    let querySelect =
      query.toLowerCase() === "memory"
        ? queryMemory
        : query.toLowerCase() === "eth"
        ? queryETH
        : queryUptime;
    let clientNodeRed = flux`` + querySelect;
    QUERY_API.queryLines(clientNodeRed, {
      next(line) {
        csv = `${csv}${line}\n`;
      },
      error(error) {
        console.error(error);
        console.log("\nFinished /nodered/client/memory ERROR");
      },
      complete() {
        console.log("\nFinished /nodered/client/memory SUCCESS");
        let results = fromFlux(csv);
        let currentDate = new Date();
        setTable({
          data: results.table,
          lastUpdated: currentDate.toLocaleTimeString(),
        });
      },
    });
  };

  useEffect(() => {
    //Runs on the first render
    try {
      getDataAndUpdateTable();
      animationFrameId = window.setInterval(
        getDataAndUpdateTable,
        REASONABLE_API_REFRESH_RATE
      );
    } catch (error) {
      console.error(error);
    }
    return () => {
      window.clearInterval(animationFrameId);
    };
  }, []);

  const renderPlot = () => {
    const fill = findStringColumns(table.data);
    //console.log(table.data.columns._value)
    const config = {
      table: table.data,
      layers: [new LayerConfig(graphType, fill.slice(0, 3)).getConfig()], //slice array to modify columns
      valueFormatters: new DataFormatter(query).getFormat(),
      xScale: "linear",
      yScale: "linear",
      legendFont: "12px sans-serif",
      legendHide: toggleLegend === 1 ? true : false,
      tickFont: "12px sans-serif",
      showAxes: graphType === "single stat" ? false : true,
      staticLegend: {
        heightRatio: 0.4,
        border: "2px solid black",
        fontBrightColor: "black",
        backgroundColor: "white",
        colorizeRows: false,
        hide: graphType === "single stat" || toggleLegend !== 1 ? true : false,
      },
    };
    return (
      <div className="static-graph-component" style={STYLE}>
        <h2>Device Stats: {query.toUpperCase()}</h2>
        <h5>Last Updated: {table.lastUpdated}</h5>
        <Plot config={config} />
      </div>
    );
  };

  const renderEmpty = () => {
    return (
      <div style={STYLE}>
        <h3>Loading...</h3>
      </div>
    );
  };

  const render = () => {
    return Object.keys(table.data).length > 0 ? renderPlot() : renderEmpty();
  };
  return render();
}
