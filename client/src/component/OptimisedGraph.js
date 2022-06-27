import React, { useEffect, useState } from "react";
import { fromFlux, Plot } from "@influxdata/giraffe";
import { findStringColumns } from "../helpers";
import GraphForm from "../forms/GraphForm";
import QueryForm from "../forms/QueryForm";
import write from "./DBWrite";
import LayerConfig from "../config/configuration/LayerConfig";
import DataFormatter from "../config/configuration/DataFormatter";
import DeviceForm from "../forms/DeviceForm";
import {
  REASONABLE_API_REFRESH_RATE,
  DEFAULT_DEVICE,
  DEFAULT_GRAPH_TYPE,
  DEFAULT_QUERY1,
  STYLE,
} from "../constants";
import {INFLUXDB_BUCKET, QUERY_API } from "../config/configuration/InfluxDBConfig";
const { flux } = require("@influxdata/influxdb-client");

let animationFrameId = 0;
function OptimisedGraph(props) {
  const [table, setTable] = useState({
    data: {},
    lastUpdated: "",
  });
  const [graphType, setGraphType] = useState(props.inputGraphType);
  const [query, setQuery] = useState(props.inputQuery);
  const [device, setDevice] = useState(props.inputDevice);
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
    |> yield(name: "min")
  from(bucket: "${INFLUXDB_BUCKET}")
    |> range(start: -60m)
    |> filter(fn: (r) => r["_measurement"] == "${device}")
    |> filter(fn: (r) => r["_field"] == "nw_eth0_rx" or r["_field"] == "nw_eth0_tx")|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
    |> yield(name: "max")
  from(bucket: "${INFLUXDB_BUCKET}")
    |> range(start: -60m)
    |> filter(fn: (r) => r["_measurement"] == "${device}")
    |> filter(fn: (r) => r["_field"] == "nw_eth0_rx" or r["_field"] == "nw_eth0_tx")|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
    |> yield(name: "mean")`;
  
  const queryUptime = `from(bucket: "${INFLUXDB_BUCKET}")
  |> range(start: -60m)
    |> filter(fn: (r) => r["_measurement"] == "${device}")
    |> filter(fn: (r) => r["_field"] == "uptime")|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
    |> yield(name: "min")
    from(bucket: "${INFLUXDB_BUCKET}")
  |> range(start: -60m)
    |> filter(fn: (r) => r["_measurement"] == "${device}")
    |> filter(fn: (r) => r["_field"] == "uptime")|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
    |> yield(name: "max")
    from(bucket: "${INFLUXDB_BUCKET}")
  |> range(start: -60m)
    |> filter(fn: (r) => r["_measurement"] == "${device}")
    |> filter(fn: (r) => r["_field"] == "uptime")|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
    |> yield(name: "mean")`;
  
  const getDataAndUpdateTable = async () => {
    let csv = "";
    let querySelect = query.toLowerCase() === 'memory' ? queryMemory : 
    query.toLowerCase() === 'eth' ? queryETH : queryUptime;
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

  useEffect(() => {
    window.clearInterval(animationFrameId);
    try {
      getDataAndUpdateTable();
      animationFrameId = window.setInterval(
        getDataAndUpdateTable,
        REASONABLE_API_REFRESH_RATE
      );
    } catch (error) {
      console.error(error);
    }
  }, [graphType, query, device]);

  const handleGraphChange = (event) => {
    setGraphType(event.target.value);
    localStorage.setItem(
      props.saveName + "_graph" + props.id,
      event.target.value
    );
    write(props.id, props.saveName + "_graph", event.target.value);
  };

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
    localStorage.setItem(
      props.saveName + "_query" + props.id,
      event.target.value
    );
    write(props.id, props.saveName + "_query", event.target.value);
  };

  const handleDeviceChange = (event) => {
    setDevice(event.target.value);
    localStorage.setItem(
      props.saveName + "_device" + props.id,
      event.target.value
    );
    write(props.id, props.saveName + "_device", event.target.value);
  };

  const reset = () => {
    setGraphType(DEFAULT_GRAPH_TYPE);
    setQuery(DEFAULT_QUERY1);
    setDevice(DEFAULT_DEVICE);
    localStorage.setItem(props.saveName + "_graph", DEFAULT_GRAPH_TYPE);
    localStorage.setItem(props.saveName + "_query", DEFAULT_QUERY1);
    localStorage.setItem(props.saveName + "_device", DEFAULT_DEVICE);
  };

  const renderPlot = () => {
    const fill = findStringColumns(table.data);
    const config = {
      table: table.data,
      layers: [new LayerConfig(graphType, fill).getConfig()],
      valueFormatters: new DataFormatter(query).getFormat(),
      xScale: "linear",
      yScale: "linear",
      legendFont: "12px sans-serif",
      legendHide: props.toggleLegend === 1 ? true : false,
      tickFont: "12px sans-serif",
      showAxes: graphType === "single stat" ? false : true,
      staticLegend: {
        heightRatio: 0.4,
        border: "2px solid black",
        fontBrightColor: "black",
        backgroundColor: "white",
        colorizeRows: false,
        hide:
          graphType === "single stat" || props.toggleLegend !== 1
            ? true
            : false,
      },
    };
    return (
      <div className="static-graph-component" style={STYLE}>
        <h2>
          <DeviceForm onChange={handleDeviceChange} device={device} />
          <GraphForm onChange={handleGraphChange} graphType={graphType} />
          <QueryForm onChange={handleQueryChange} query={query} />
        </h2>
        <h5>Last Updated: {table.lastUpdated}</h5>
        <Plot config={config} />
      </div>
    );
  };

  const renderEmpty = () => {
    return (
      <div style={STYLE}>
        <button onClick={() => reset()}>Reboot</button>
        <h3>Loading...</h3>
      </div>
    );
  };

  const render = () => {
    console.log("graph rendered");
    return Object.keys(table.data).length > 0 ? renderPlot() : renderEmpty();
  };
  return render();
}
export default React.memo(OptimisedGraph);
