import { fromFlux, Plot } from "@influxdata/giraffe";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
//import DataFormatter from "../config/configuration/DataFormatter";
import { Button } from "@mui/material";
import DataFormatter from "../config/configuration/DataFormatter";
import LayerConfig from "../config/configuration/LayerConfig";
import { API_REFRESH_RATE, AWS_API_URL, AWS_AUTH, GraphType } from "../constants";
import DeviceForm from "../forms/DeviceForm";
import GatewayForm from "../forms/GatewayForm";
import GraphForm from "../forms/GraphForm";
import MetricForm from "../forms/MetricForm";
import { findStringColumns } from "../helpers";
import Alert from "@mui/material/Alert";

function Graph(props) {
  let animationFrameId = useRef(0);
  let isMount = useRef(false);
  const [table, setTable] = useState({
    data: {},
    lastUpdated: "",
  });
  const [graph, setGraph] = useState(props.graph);
  const [lists, setLists] = useState(props.list);
  const [toggleLegend, setToggleLegend] = useState(1);

  const getData = async () => {
    try {
     const url = AWS_API_URL + `/gateways/trenddata?metric=${graph?.metric?.name}&gateway=${graph?.gateway?._measurement}`
    const resp = await axios.get(url, AWS_AUTH)
      let results = fromFlux(resp.data.csv);
      console.log(results)
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
  //id, edge_id, measurement
  const getGateway = async () => {
    try {
      const url = AWS_API_URL + `/gateways`;
      const resp = await axios.get(url, AWS_AUTH);
      const list = [];
      JSON.parse(resp.data.body).map((item) => {
        const newObj = { id: item.id, edge_id: item.edge_id, name: item.name.toLowerCase() };
        return list.push(newObj);
      });
      setLists((prevState) => ({ ...prevState, gateway: list }));
      localStorage.setItem(
        props.saveName + "_lists_" + props.id,
        JSON.stringify({ ...lists, gateway: list })
      );
    } catch (error) {
      console.log(error);
    }
  };
  //id device_id name
  const getMetric = async () => {
    try {
      const url = AWS_API_URL + `/gateways/${graph?.gateway?.id}/devices/${graph?.device?.id}/metrics`;
      const resp = await axios.get(url, AWS_AUTH);
      const list = [];
      resp.data.map((item) => {
        const newObj = { id: item.id, device_id: item.device_id, name: item.name };
        return list.push(newObj);
      });
      setLists((prevState) => ({ ...prevState, metric: list }));
      localStorage.setItem(
        props.saveName + "_lists_" + props.id,
        JSON.stringify({ ...lists, metric: list })
      );
    } catch (error) {
      console.log(error);
    }
  };
  const getDevice = async () => {
    try {
      const url = AWS_API_URL + `/gateways/${graph?.gateway?.id}/devices`;
      const resp = await axios.get(url, AWS_AUTH);
      const list = [];
      resp.data.map((item) => {
        const newObj = { id: item.id, gateway_id: item.gateway_id,  name: item.name };
        return list.push(newObj);
      });
      setLists((prevState) => ({ ...prevState, device: list }));
      localStorage.setItem(
        props.saveName + "_lists_" + props.id,
        JSON.stringify({ ...lists, device: list })
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
  }, [graph?.type, graph?.metric]);

  useEffect(() => {
    setTable((prevState) => ({ ...prevState, data: {} }));
    getDevice();
    // eslint-disable-next-line
  }, [graph?.gateway]);

  useEffect(() => {
    setTable((prevState) => ({ ...prevState, data: {} }));
    getMetric();
    // eslint-disable-next-line
  }, [graph?.device]);

  useEffect(() => {
    setToggleLegend(props.toggleLegend);
  }, [props.toggleLegend]);

  //graphtype:[{graphtype,metric,device,gateway,gatewaylist,devicelist,metricelist},]
  const handleGraphChange = (event) => {
    setTable((prevState) => ({ ...prevState, data: {} }));
    setGraph((prevState) => ({ ...prevState, type: event.target.value }));
    localStorage.setItem(
      props.saveName + "_graph_" + props.id,
      JSON.stringify({ ...graph, type: event.target.value })
    );
    // write(props.id, props.saveName + "_graph_", event.target.value);
  };

  const handleMetricChange = (event) => {
    const select = lists?.metric?.filter((m) => {
      return m.name === event.target.value;
    });
    setGraph((prevState) => ({ ...prevState, metric: select[0] }));
    localStorage.setItem(
      props.saveName + "_graph_" + props.id,
      JSON.stringify({ ...graph, metric: select[0] })
    );
    // write(props.id, props.saveName + "_query_", event.target.value);
  };

  const handleDeviceChange = (event) => {
    const select = lists?.device?.filter((d) => {
      return d.name === event.target.value;
    });
    setGraph((prevState) => ({ ...prevState, device: select[0] }));
    localStorage.setItem(
      props.saveName + "_graph_" + props.id,
      JSON.stringify({ ...graph, device: select[0] })
    );
    //  write(props.id, props.saveName + "_device_", event.target.value);
  };

  const handleGatewayChange = (event) => {
    const select = lists?.gateway?.filter((gateway) => {
      return gateway.edge_id === event.target.value;
    });
    setGraph((prevState) => ({ ...prevState, gateway: select[0] }));
    localStorage.setItem(
      props.saveName + "_graph_" + props.id,
      JSON.stringify({ ...graph, gateway: select[0] })
    );
    // write(props.id, props.saveName + "_drive_", event.target.value);
  };

  const reset = () => {
    setGraph([]);
    // getDevice();
    localStorage.setItem(props.saveName + "_graph", []);
  };

  const renderPlot = () => {
    const fill = findStringColumns(table.data);
    const { unit } = table.data.columns;
    const config = {
      table: table.data,
      layers: [new LayerConfig(graph.type?.toUpperCase(), fill).getConfig()],
      valueFormatters: new DataFormatter(graph?.metric?.name, unit).getFormat(),
      xScale: "linear",
      yScale: "linear",
      legendFont: "12px sans-serif",
      legendHide: toggleLegend === 1 ? true : false,
      tickFont: "12px sans-serif",
      showAxes:
        graph?.type?.toUpperCase() === GraphType["SINGLE STAT"] ? false : true,
      staticLegend: {
        heightRatio: 0.4,
        border: "2px solid black",
        fontBrightColor: "black",
        backgroundColor: "white",
        colorizeRows: false,
        hide:
          graph?.type?.toUpperCase() === GraphType.BAR ||
          graph?.type?.toUpperCase() === GraphType["SINGLE STAT"] ||
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
              gateway={graph?.gateway}
              gatewayList={lists?.gateway}
            />
            <DeviceForm
              onChange={handleDeviceChange}
              device={graph?.device}
              deviceList={lists?.device}
            />
            <MetricForm
              onChange={handleMetricChange}
              metric={graph?.metric}
              metricList={lists?.metric}
            />
            <GraphForm onChange={handleGraphChange} graphType={graph?.type} />
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
              gateway={graph?.gateway}
              gatewayList={lists?.gateway}
            />
            <DeviceForm
              onChange={handleDeviceChange}
              device={graph?.device}
              deviceList={lists?.device}
            />
            <MetricForm
              onChange={handleMetricChange}
              metric={graph?.metric}
              metricList={lists?.metric}
            />
            <GraphForm onChange={handleGraphChange} graphType={graph?.type} />
          </div>
        </div>
        <div className="nodatatext">
          <Alert severity="warning" variant="filled">
            No data found!
          </Alert>
        </div>
        <div className="dotwrapper">
          <p className="loading">Retrying</p>
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
