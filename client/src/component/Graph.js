import { fromFlux, Plot } from "@influxdata/giraffe";
import AppsIcon from "@mui/icons-material/Apps";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import DataFormatter from "../config/configuration/DataFormatter";
import LayerConfig from "../config/configuration/LayerConfig";
import {
  API_REFRESH_RATE,
  DEFAULT_CPU,
  DEFAULT_DEVICE,
  DEFAULT_DRIVE,
  DEFAULT_GRAPH_TYPE,
  DEFAULT_QUERY_1,
  REST_URL,
} from "../constants";
import CPUForm from "../forms/CPUForm";
import DeviceForm from "../forms/DeviceForm";
import DrivesForm from "../forms/DrivesForm";
import GatewayForm from "../forms/GatewayForm";
import GraphForm from "../forms/GraphForm";
import QueryForm from "../forms/QueryForm";
import { findStringColumns, uriSelector } from "../helpers";
import write from "./DBWrite";
import "./Graph.css";

function Graph(props) {
  let animationFrameId = useRef(0);
  let isMount = useRef(false);
  const [table, setTable] = useState({
    data: {},
    lastUpdated: "",
  });
  const [graphType, setGraphType] = useState(props.inputGraphType);
  const [query, setQuery] = useState(props.inputQuery);
  const [device, setDevice] = useState(props.inputDevice);
  const [cpuID, setCPUID] = useState(props.inputCPUID);
  const [drive, setDrive] = useState(props.inputDrive);
  const [toggleLegend, setToggleLegend] = useState(1);
  const [measurementList, setMeasurementList] = useState([]);
  const [driveList, setDriveList] = useState([]);
  const [cpuList, setCPUList] = useState([]);

  const getData = async () => {
    let uri = uriSelector(graphType, query, device, cpuID, drive);
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
  //Gateway SCM-001 -> Display as Edge ID for User
  const getMeasurements = async () => {
    try {
      const resp = await axios.get(REST_URL + "/list/_measurement");
      const { list } = resp.data;
      setMeasurementList(list);
    } catch (error) {
      console.log(error);
    }
  };
  const getDrives = async () => {
    try {
      const resp = await axios.get(REST_URL + "/list/mount");
      const { list } = resp.data;
      setDriveList(list);
    } catch (error) {
      console.log(error);
    }
  };
  const getCPU = async () => {
    try {
      const resp = await axios.get(REST_URL + "/list/cpu");
      const { list } = resp.data;
      setCPUList(list);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    //Runs on the first render
    isMount.current = true;
    /*
    getGateway()
    getDevice()
    getMetric()
    */
    getMeasurements();   
    getDrives();
    getCPU();
    return () => {
      window.clearInterval(animationFrameId.current);
      setToggleLegend(-1);
      isMount.current = false;
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    //reset table
    //window.clearInterval(animationFrameId.current);
    setToggleLegend(-1);
    setTable((prevState) => ({ ...prevState, data: {} }));
    try {
      getData();
      animationFrameId.current = window.setInterval(getData, API_REFRESH_RATE);
    } catch (error) {
      console.log(error);
    }
    return () => {
      window.clearInterval(animationFrameId.current);
      setTable((prevState) => ({ ...prevState, data: {} }));
    };
    // eslint-disable-next-line
  }, [graphType, query, device, cpuID, drive]);

  useEffect(() => {
    setToggleLegend(props.toggleLegend);
  }, [props.toggleLegend]);

  const handleGraphChange = (event) => {
    setGraphType(event.target.value);
    localStorage.setItem(
      props.saveName + "_graph_" + props.id,
      event.target.value
    );
   // write(props.id, props.saveName + "_graph_", event.target.value);
  };

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
    localStorage.setItem(
      props.saveName + "_query_" + props.id,
      event.target.value
    );
   // write(props.id, props.saveName + "_query_", event.target.value);
  };

  const handleDeviceChange = (event) => {
    setDevice(event.target.value);
    localStorage.setItem(
      props.saveName + "_device_" + props.id,
      event.target.value
    );
  //  write(props.id, props.saveName + "_device_", event.target.value);
  };
  const handleCPUChange = (event) => {
    setCPUID(event.target.value);
    localStorage.setItem(
      props.saveName + "_cpu_" + props.id,
      event.target.value
    );
    //write(props.id, props.saveName + "_cpu_", event.target.value);
  };
  const handleDriveChange = (event) => {
    setDrive(event.target.value);
    localStorage.setItem(
      props.saveName + "_drive_" + props.id,
      event.target.value
    );
   // write(props.id, props.saveName + "_drive_", event.target.value);
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
    localStorage.setItem(props.saveName + "_drive", DEFAULT_DRIVE);
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
      <div className="graph-component">
        <div className="topcontainer">
          <div className="removebutton" onClick={props.handleRemoveItem}>
            <DisabledByDefaultIcon color="error" />
          </div>
          <div className="draghandle">
            <AppsIcon />
          </div>
          <div className="forms">
            {/* <GatewayForm/> */}
            <DeviceForm
              onChange={handleDeviceChange}
              device={device}
              measurementList={measurementList}
            />
            <GraphForm onChange={handleGraphChange} graphType={graphType} />
            <QueryForm onChange={handleQueryChange} query={query} />
            <CPUForm
              onChange={handleCPUChange}
              query={query}
              cpuID={cpuID}
              cpuList={cpuList}
            />
            <DrivesForm
              onChange={handleDriveChange}
              query={query}
              drive={drive}
              driveList={driveList}
            />
          </div>
        </div>
        <div className="last-update">Last Updated: {table.lastUpdated}</div>
        <div className="plot">
          <Plot config={config} />
        </div>
      </div>
    );
  };

  const renderEmpty = () => {
    return (
      <div className="loadcontainer">
        <button onClick={() => reset()}>Reboot</button>
        <div className="draghandle">
          <AppsIcon />
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
