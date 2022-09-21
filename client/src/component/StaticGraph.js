import React, { useEffect, useRef, useState } from "react";
import { fromFlux, Plot } from "@influxdata/giraffe";
import { findStringColumns, uriSelector } from "../helpers";
import LayerConfig from "../config/configuration/LayerConfig";
import DataFormatter from "../config/configuration/DataFormatter";
import { STATIC_API_REFRESH_RATE, REST_URL, STYLE } from "../constants";
import axios from "axios";

export default function StaticGraph({
  device,
  graphType,
  query,
  cpu,
  drive,
  toggleLegend,
}) {
  let staticAnimationIDrz = useRef(0);
  const [table, setTable] = useState({
    data: {},
    lastUpdated: "",
  });
  const getData = async () => {
    let uri = uriSelector(graphType, query, device, cpu, drive);
    const resp = await axios.get(REST_URL + uri);
    console.log(resp);
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
      staticAnimationIDrz.current = window.setInterval(
        getData,
        STATIC_API_REFRESH_RATE
      );
    } catch (error) {
      console.error(error);
    }
    return () => {
      console.log("unmounted");
      window.clearInterval(staticAnimationIDrz.current);
    };
    // eslint-disable-next-line
  }, []);

  function checkFills(fill) {
    if (graphType === "line") {
      return fill !== "topic";
    }
    return fill !== "topic";
  }
  const renderPlot = () => {
    const fill = findStringColumns(table.data);
    //filter data for different graph type
   // console.log(table.data.columns.result.data.filter((data) => {return data === "last"}))
    const config = {
      table: table.data,
      layers: [new LayerConfig(graphType, fill.filter(checkFills)).getConfig()],
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
      <div className="graph-component">
        <div className="device-stats">Device Stats: {query.toUpperCase()}</div>
        <div className="last-update">Last Updated: {table.lastUpdated}</div>
        <div className="plot">
          <Plot config={config} />
        </div>
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
