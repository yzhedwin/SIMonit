import React, { useEffect, useState } from "react";
import { fromFlux, Plot } from "@influxdata/giraffe";
import axios from "axios";
import { findStringColumns } from "../helpers";
import GraphForm from "../forms/GraphForm";
import QueryForm from "../forms/QueryForm";
import write from "./DBWrite";
import LayerConfig from "../config/configuration/LayerConfig";
import DataFormatter from "../config/configuration/DataFormatter";

const REASONABLE_API_REFRESH_RATE = 5000;
const DEFAULT_GRAPH_TYPE = "band";
const DEFAULT_QUERY = "nodered/client/eth";

const style = {
  margin: "5px",
  height: "60%",
  width: "90%",
};

let animationFrameId = 0;
export default function StaticGraph({
  id,
  device,
  toggleLegend,
}) {
  let [table, setTable] = useState({
    data: {},
    lastUpdated: "",
  });
  let [graphType, setGraphType] = useState(DEFAULT_GRAPH_TYPE);
  let [query, setQuery] = useState(DEFAULT_QUERY);

  let getDataAndUpdateTable = async () => {
    let resp = await axios.get(
      "http://localhost:3001/" + device + "/" + query
    );
    try {
      let results = fromFlux(resp.data.csv);
      let currentDate = new Date();
      setTable({data: results.table,
        lastUpdated: currentDate.toLocaleTimeString()});
    } catch (error) {
      console.error("error", error.message);
    }
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
  }, [graphType, query])

  const handleGraphChange = (event) => {
    setGraphType(event.target.value);
    localStorage.setItem("graph" + id, event.target.value);
    write(id, "graph", event.target.value);
  };

  const handleQueryChange = (event) => {
    setQuery(event.target.value );
    localStorage.setItem("query" + id, event.target.value);
    write(id, "query", event.target.value);
  };

  const reset = () => {
    setGraphType(DEFAULT_GRAPH_TYPE);
    setQuery(DEFAULT_QUERY);
    localStorage.setItem("graph", DEFAULT_GRAPH_TYPE);
    localStorage.setItem("query", DEFAULT_QUERY);
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
      showAxes: true,
      staticLegend: {
        heightRatio: 0.4,
        border: "2px solid black",
        fontBrightColor: "black",
        backgroundColor: "white",
        colorizeRows: false,
        hide: toggleLegend === 1 ? false : true,
      },
    };
    return (
      <div className="static-graph-component" style={style}>
        <h2>
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
      <div style={style}>
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