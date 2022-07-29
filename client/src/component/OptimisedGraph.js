import React, { useEffect, useState, useRef } from "react";
import { fromFlux, Plot } from "@influxdata/giraffe";
import { findStringColumns } from "../helpers";
import GraphForm from "../forms/GraphForm";
import QueryForm from "../forms/QueryForm";
import write from "./DBWrite";
import LayerConfig from "../config/configuration/LayerConfig";
import DataFormatter from "../config/configuration/DataFormatter";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import DeviceForm from "../forms/DeviceForm";
import "./Graph.css";
import {
  API_REFRESH_RATE,
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
  FLUX_QUERY_DRIVE,
  DEFAULT_DRIVE,
  FLUX_QUERY_DRIVE_BAND,
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
  const [toggleLegend, setToggleLegend] = useState(1);

  const getData = async () => {
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
        if (results.table.length > 0) {
          setTable({
            data: results.table,
            lastUpdated: currentDate.toLocaleTimeString(),
          });
        } else {
          setTable({
            data: {},
            lastUpdated: currentDate.toLocaleTimeString(),
          });
        }
      },
    });
  };
  useEffect(() => {
    //Runs on the first render
    isMount.current = true;
    try {
      getData();
      animationFrameId = window.setInterval(getData, API_REFRESH_RATE);
    } catch (error) {
      console.error(error);
    }
    return () => {
      window.clearInterval(animationFrameId);
      setToggleLegend(-1);
      isMount.current = false;
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    //reset table
    setToggleLegend(-1);
    setTable((prevState) => ({ ...prevState, data: {} }));
    window.clearInterval(animationFrameId);
    getData();
    try {
      animationFrameId = window.setInterval(getData, API_REFRESH_RATE);
    } catch (error) {
      console.error(error);
    }
    return () => {
      console.log("unmount");
      window.clearInterval(animationFrameId);
      setTable((prevState) => ({ ...prevState, data: {} }));
    };
    // eslint-disable-next-line
  }, [graphType, query, device, cpuID]);

  useEffect(() => {
    setToggleLegend(props.toggleLegend);
  }, [props.toggleLegend]);

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
      legendHide: toggleLegend === 1 ? true : false,
      tickFont: "12px sans-serif",
      showAxes: graphType === "single stat" ? false : true,
      staticLegend: {
        heightRatio: 0.4,
        border: "2px solid black",
        fontBrightColor: "black",
        backgroundColor: "white",
        colorizeRows: false,
        hide:
          graphType === "bar" ||
          graphType === "single stat" ||
          toggleLegend !== 1
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
        <div className="draghandle">
          <DragHandleIcon />
        </div>
        <div className="dotwrapper">
          <p className="loading">Loading</p>
          <div className="dot0" />
          <div className="dot1" />
          <div className="dot2" />
        </div>
      </div>
    );
  };

  const render = () => {
    try {
      return Object.keys(table.data).length > 0 ? renderPlot() : renderEmpty();
    } catch (error) {
      console.log(error);
    }
  };
  return render();
}
export default React.memo(OptimisedGraph);

function querySelector(query, graphType, device, cpuID) {
  return query.toLowerCase() === "load" && graphType === "band"
    ? FLUX_QUERY_LOAD_BAND(INFLUXDB_BUCKET, device)
    : query.toLowerCase() === "load" && graphType !== "band"
    ? FLUX_QUERY_LOAD(INFLUXDB_BUCKET, device)
    : query.toLowerCase() === "drive" && graphType !== "band"
    ? FLUX_QUERY_DRIVE(INFLUXDB_BUCKET, device, DEFAULT_DRIVE)
    : query.toLowerCase() === "drive" && graphType === "band"
    ? FLUX_QUERY_DRIVE_BAND(INFLUXDB_BUCKET, device, DEFAULT_DRIVE)
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
