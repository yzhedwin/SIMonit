import React, { useEffect, useState } from "react";
import { fromFlux, Plot } from "@influxdata/giraffe";
import { findStringColumns } from "../helpers";
import LayerConfig from "../config/configuration/LayerConfig";
import DataFormatter from "../config/configuration/DataFormatter";
import { DEFAULT_CPU, API_REFRESH_RATE, REST_URL, STYLE } from "../constants";
import axios from "axios";

let animationFrameId = 0;
export default function StaticGraph({
  device,
  graphType,
  query,
  toggleLegend,
}) {
  const [table, setTable] = useState({
    data: {},
    lastUpdated: "",
  });
  const getData = async () => {
    let uri =
      query.toLowerCase() === "memory"
        ? "/memory/" + device
        : graphType.toLowerCase() === "bar" && query.toLowerCase() === "memory"
        ? "/memorybar/" + device
        : graphType.toLowerCase() === "bar" && query.toLowerCase() === "drive"
        ? "/drivebar/" + device
        : query.toLowerCase() === "load"
        ? "/load/" + device
        : query.toLowerCase() === "cpu"
        ? "/cpu/" + device + "/" + DEFAULT_CPU
        : query.toLowerCase() === "drive"
        ? "/drive/" + device
        : "/uptime/" + device;
    const resp = await axios.get(REST_URL + uri);
    try {
      let results = fromFlux(resp.data.csv);
      let currentDate = new Date();
      setTable({
        data: results.table,
        lastUpdated: currentDate.toLocaleTimeString(),
      });
    } catch (error) {
      console.error("error", error.message);
    }
  };

  useEffect(() => {
    //Runs on the first render
    try {
      getData();
      animationFrameId = window.setInterval(getData, API_REFRESH_RATE);
    } catch (error) {
      console.error(error);
    }
    return () => {
      window.clearInterval(animationFrameId);
    };
    // eslint-disable-next-line
  }, []);

  const renderPlot = () => {
    const fill = findStringColumns(table.data);
    const config = {
      table: table.data,
      layers: [new LayerConfig(graphType, fill).getConfig()],
      valueFormatters: new DataFormatter(query).getFormat(),
      xScale: "linear",
      yScale: "linear",
      legendFont: "12px sans-serif",
      legendHide: graphType !== "bar" && toggleLegend === 1 ? true : false,
      showAxes: graphType === "single stat" ? false : true,
      staticLegend: {
        heightRatio: 0.4,
        border: "1px solid black",
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
        <h5>Device Stats: {query.toUpperCase()}</h5>
        <span>Last Updated: {table.lastUpdated}</span>
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
