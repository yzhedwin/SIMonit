import { fromFlux, Plot } from "@influxdata/giraffe";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
//import DataFormatter from "../config/configuration/DataFormatter";
import { Button } from "@mui/material";
import DataFormatter from "../config/configuration/DataFormatter";
import LayerConfig from "../config/configuration/LayerConfig";
import {
  API_REFRESH_RATE,
  DEFAULT_GATEWAY,
  DEFAULT_GRAPH_TYPE,
  GraphType,
  REST_URL
} from "../constants";
import DeviceForm from "../forms/DeviceForm";
import GatewayForm from "../forms/GatewayForm";
import GraphForm from "../forms/GraphForm";
import MetricForm from "../forms/MetricForm";
import { findStringColumns } from "../helpers";
import "./Graph.css";

function Graph(props) {
  let animationFrameId = useRef(0);
  let isMount = useRef(false);
  const [table, setTable] = useState({
    data: {},
    lastUpdated: "",
  });
  const [graphType, setGraphType] = useState(props.graphType);
  const [metric, setMetric] = useState(props.metric);
  const [device, setDevice] = useState(props.device);
  const [gateway, setGateway] = useState(props.gateway);
  const [toggleLegend, setToggleLegend] = useState(1);
  const [gatewayList, setGatewayList] = useState(props.gatewayList);
  const [deviceList, setDeviceList] = useState(props.deviceList);
  const [metricList, setMetricList] = useState(props.metricList);

  const getData = async () => {
    try {
      const resp = await axios.get(
        `${REST_URL}/table/${gateway?._measurement}/${metric?.name}`
      );
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

  const getGateway = async () => {
    try {
      const resp = await axios.get(REST_URL + "/gatewaylist");
      const { list } = resp.data;
      setGatewayList(list);
      localStorage.setItem(
        props.saveName + "_gatewayList_" + props.id,
        JSON.stringify(list)
      );
    } catch (error) {
      console.log(error);
    }
  };
  const getMetric = async () => {
    try {
      const resp = await axios.get(`${REST_URL}/metriclist/${device?.id}`);
      const { list } = resp.data;
      setMetricList(list);
      localStorage.setItem(
        props.saveName + "_metricList_" + props.id,
        JSON.stringify(list)
      );
    } catch (error) {
      console.log(error);
    }
  };
  const getDevice = async () => {
    try {
      const resp = await axios.get(`${REST_URL}/devicelist/${gateway?.id}/`);
      const { list } = resp.data;
      setDeviceList(list);
      localStorage.setItem(
        props.saveName + "_deviceList_" + props.id,
        JSON.stringify(list)
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    isMount.current = true;
    try {
      getGateway();
      getData();
      animationFrameId.current = window.setInterval(getData, API_REFRESH_RATE);
    } catch (error) {
      console.log(error);
    }
    return () => {
      window.clearInterval(animationFrameId.current);
      setToggleLegend(-1);
      isMount.current = false;
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    //reset table
    setToggleLegend(-1);
    setTable((prevState) => ({ ...prevState, data: {} }));
    try {
      window.clearInterval(animationFrameId.current);
      getData();
      animationFrameId.current = window.setInterval(getData, API_REFRESH_RATE);
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line
  }, [graphType, metric]);

  useEffect(() => {
    getDevice();
    // eslint-disable-next-line
  }, [gateway]);

  useEffect(() => {
    getMetric();
    // eslint-disable-next-line
  }, [device]);

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

  const handleMetricChange = (event) => {
    const select = metricList.filter((m) => {
      return m.name === event.target.value;
    });
    setMetric(select[0]);
    localStorage.setItem(
      props.saveName + "_metric_" + props.id,
      JSON.stringify(select[0])
    );
    // write(props.id, props.saveName + "_query_", event.target.value);
  };

  const handleDeviceChange = (event) => {
    const select = deviceList.filter((d) => {
      return d.name === event.target.value;
    });
    setDevice(select[0]);
    localStorage.setItem(
      props.saveName + "_device_" + props.id,
      JSON.stringify(select[0])
    );
    //  write(props.id, props.saveName + "_device_", event.target.value);
  };

  const handleGatewayChange = (event) => {
    const newGatewayList = gatewayList.filter((gateway) => {
      return gateway.edge_id === event.target.value;
    });
    setGateway(newGatewayList[0]);
    localStorage.setItem(
      props.saveName + "_gateway_" + props.id,
      JSON.stringify(newGatewayList[0])
    );
    // write(props.id, props.saveName + "_drive_", event.target.value);
  };

  const reset = () => {
    setGraphType(DEFAULT_GRAPH_TYPE);
    setGateway(JSON.parse(DEFAULT_GATEWAY));
    getDevice();
    localStorage.setItem(props.saveName + "_graph", DEFAULT_GRAPH_TYPE);
    localStorage.setItem(
      props.saveName + "_gateway_" + props.id,
      DEFAULT_GATEWAY
    );
  };

  const renderPlot = () => {
    const fill = findStringColumns(table.data);
    const { unit } = table.data.columns;
    const config = {
      table: table.data,
      layers: [new LayerConfig(graphType, fill).getConfig()],
      valueFormatters: new DataFormatter(metric?.name, unit).getFormat(),
      xScale: "linear",
      yScale: "linear",
      legendFont: "12px sans-serif",
      legendHide: toggleLegend === 1 ? true : false,
      tickFont: "12px sans-serif",
      showAxes: graphType === GraphType.SINGLE_STAT ? false : true,
      staticLegend: {
        heightRatio: 0.4,
        border: "2px solid black",
        fontBrightColor: "black",
        backgroundColor: "white",
        colorizeRows: false,
        hide:
          graphType === GraphType.BAR ||
          graphType === GraphType.SINGLE_STAT ||
          toggleLegend !== 1
            ? true
            : false,
      },
    };
    return (
      <div className="graph-component">
        <div className="topcontainer">
          <div className="forms">
            <GatewayForm
              onChange={handleGatewayChange}
              gateway={gateway}
              gatewayList={gatewayList}
            />
            <DeviceForm
              onChange={handleDeviceChange}
              device={device}
              deviceList={deviceList}
            ></DeviceForm>
            <MetricForm
              onChange={handleMetricChange}
              metric={metric}
              metricList={metricList}
            />
            <GraphForm onChange={handleGraphChange} graphType={graphType} />
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
      <div className="graph-component">
        <div className="topcontainer">
          <div className="forms">
            <GatewayForm
              onChange={handleGatewayChange}
              gateway={gateway}
              gatewayList={gatewayList}
            />
            <DeviceForm
              onChange={handleDeviceChange}
              device={device}
              deviceList={deviceList}
            />
            <MetricForm
              onChange={handleMetricChange}
              metric={metric}
              metricList={metricList}
            />
            <GraphForm onChange={handleGraphChange} graphType={graphType} />
          </div>
        </div>
        <div className="dotwrapper">
          <p className="loading">Loading</p>
          <div className="dot0" />
          <div className="dot1" />
          <div className="dot2" />
        </div>
        <div className="reset-button">
          <Button variant="contained" color="primary" onClick={() => reset()}>
            Reset
          </Button>
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
