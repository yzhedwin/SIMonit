import React, { useEffect, useState, useRef } from "react";
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
  DEFAULT_QUERY_1,
  STYLE,
  FLUX_QUERY_MEMORY,
  FLUX_QUERY_UPTIME,
  FLUX_QUERY_UPTIME_BAND,
  FLUX_QUERY_LOAD,
  FLUX_QUERY_CPU,
  DEFAULT_CPU,
  FLUX_QUERY_LOAD_BAND,
  FLUX_QUERY_CPU_BAND,
  FLUX_QUERY_MEMORY_BAND,
} from "../constants";
import {
  INFLUXDB_BUCKET,
  QUERY_API,
} from "../config/configuration/InfluxDBConfig";
import CPUForm from "../forms/CPUForm";
const { flux } = require("@influxdata/influxdb-client");

let animationFrameId = 0;
function OptimisedGraph(props) {
  let isMount = useRef(false);
  const [table, setTable] = useState({
    data: {},
    lastUpdated: "",
  });
  const [graphType, setGraphType] = useState(props.inputGraphType);
  const [query, setQuery] = useState(props.inputQuery);
  const [device, setDevice] = useState(props.inputDevice);
  const [cpuID, setCPUID] = useState(props.inputCPUID);

  const getDataAndUpdateTable = async () => {
    let csv = "";
    let querySelect = querySelector(query, graphType, device, cpuID);
    let clientNodeRed = flux`` + querySelect;
    QUERY_API.queryLines(clientNodeRed, {
      next(line) {
        csv = `${csv}${line}\n`;
      },
      error(error) {
        console.error(error);
        console.log("\nFinish with ERROR on " + query);
      },
      complete() {
        console.log("\nFinish with SUCCESS on " + query);
        let results = fromFlux(csv);
        let currentDate = new Date();
        if (!isMount.current) {
          return null;
        }
        setTable({
          data: results.table,
          lastUpdated: currentDate.toLocaleTimeString(),
        });
      },
    });
  };
  useEffect(() => {
    //Runs on the first render
    isMount.current = true;
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
      isMount.current = false;
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    window.clearInterval(animationFrameId);
    try {
      animationFrameId = window.setInterval(
        getDataAndUpdateTable,
        REASONABLE_API_REFRESH_RATE
      );
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line
  }, [graphType, query, device, cpuID, props.toggleLegend]);

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
  const handleCPUChange = (event) => {
    setCPUID(event.target.value);
    localStorage.setItem(
      props.saveName + "_cpu" + props.id,
      event.target.value
    );
    write(props.id, props.saveName + "_cpu", event.target.value);
  };

  const reset = () => {
    setGraphType(DEFAULT_GRAPH_TYPE);
    setQuery(DEFAULT_QUERY_1);
    setDevice(DEFAULT_DEVICE);
    setCPUID(DEFAULT_CPU);
    localStorage.setItem(props.saveName + "_graph", DEFAULT_GRAPH_TYPE);
    localStorage.setItem(props.saveName + "_query", DEFAULT_QUERY_1);
    localStorage.setItem(props.saveName + "_device", DEFAULT_DEVICE);
    localStorage.setItem(props.saveName + "_cpu", DEFAULT_CPU);
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
          <CPUForm onChange={handleCPUChange} cpuID={cpuID} query={query} />
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
    return Object.keys(table.data).length > 0 ? renderPlot() : renderEmpty();
  };
  return render();
}
export default React.memo(OptimisedGraph);

function querySelector(query, graphType, device, cpuID) {
  return query.toLowerCase() === "load" && graphType === "band"
    ? FLUX_QUERY_LOAD_BAND(INFLUXDB_BUCKET, device)
    : query.toLowerCase() === "load" && graphType !== "band"
    ? FLUX_QUERY_LOAD(INFLUXDB_BUCKET, device)
    : query.toLowerCase() === "uptime" && graphType !== "band"
    ? FLUX_QUERY_UPTIME(INFLUXDB_BUCKET, device)
    : query.toLowerCase() === "uptime" && graphType === "band"
    ? FLUX_QUERY_UPTIME_BAND(INFLUXDB_BUCKET, device)
    : query.toLowerCase() === "cpu" && graphType === "band"
    ? FLUX_QUERY_CPU_BAND(INFLUXDB_BUCKET, device, cpuID)
    : query.toLowerCase() === "cpu" && graphType !== "band"
    ? FLUX_QUERY_CPU(INFLUXDB_BUCKET, device, cpuID)
    : query.toLowerCase() === "memory" && graphType === "band"
    ? FLUX_QUERY_MEMORY_BAND(INFLUXDB_BUCKET, device)
    : FLUX_QUERY_MEMORY(INFLUXDB_BUCKET, device);
}
