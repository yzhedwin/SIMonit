import { fromFlux, Plot } from "@influxdata/giraffe";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import DataFormatter from "../config/configuration/DataFormatter";
import LayerConfig from "../config/configuration/LayerConfig";
import {
  API_REFRESH_RATE, DEFAULT_CPU, DEFAULT_DEVICE,
  DEFAULT_GRAPH_TYPE,
  DEFAULT_QUERY_1, REST_URL, STYLE
} from "../constants";
import CPUForm from "../forms/CPUForm";
import DeviceForm from "../forms/DeviceForm";
import GraphForm from "../forms/GraphForm";
import QueryForm from "../forms/QueryForm";
import { findStringColumns, uriSelector } from "../helpers";
import write from "./DBWrite";
import "./Graph.css";

let animationFrameId = 0;
function Graph(props) {
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
    let uri = uriSelector(graphType, query, device);
    try {
      const resp = await axios.get(REST_URL + uri);
      let results = fromFlux(resp.data.csv);
      let currentDate = new Date();
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
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    //Runs on the first render
    isMount.current = true;
    return () => {
      window.clearInterval(animationFrameId);
      setToggleLegend(-1);
      isMount.current = false;
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    //reset table
    //window.clearInterval(animationFrameId);
    setToggleLegend(-1);
    setTable((prevState) => ({ ...prevState, data: {} }));
    try {
      getData();
      animationFrameId = window.setInterval(getData, API_REFRESH_RATE);
    } catch (error) {
      console.log(error);
    }
    return () => {
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
        <div className="draghandle">
          <DragHandleIcon />
        </div>
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
export default React.memo(Graph);