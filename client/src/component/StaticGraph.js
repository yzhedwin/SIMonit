import React, { useEffect, useState } from "react";
import { fromFlux, Plot } from "@influxdata/giraffe";
import { findStringColumns } from "../helpers";
import LayerConfig from "../config/configuration/LayerConfig";
import DataFormatter from "../config/configuration/DataFormatter";
import { DEFAULT_CPU, DEFAULT_DRIVE, FLUX_QUERY_CPU, FLUX_QUERY_DRIVE, FLUX_QUERY_LOAD, FLUX_QUERY_MEMORY, FLUX_QUERY_UPTIME, REASONABLE_API_REFRESH_RATE, STYLE } from "../constants";
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

  const getDataAndUpdateTable = async () => {
    let csv = "";
    let querySelect =
      query.toLowerCase() === "memory"
        ? FLUX_QUERY_MEMORY(INFLUXDB_BUCKET, device)
        : query.toLowerCase() === "load"
        ? FLUX_QUERY_LOAD(INFLUXDB_BUCKET, device)
        : query.toLowerCase() === "cpu"
        ? FLUX_QUERY_CPU(INFLUXDB_BUCKET, device, DEFAULT_CPU)
        : query.toLowerCase() === "drive"
        ? FLUX_QUERY_DRIVE(INFLUXDB_BUCKET, device, DEFAULT_DRIVE)
        : FLUX_QUERY_UPTIME(INFLUXDB_BUCKET, device);
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
 // eslint-disable-next-line
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
        <h4>Device Stats: {query.toUpperCase()}</h4>
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
