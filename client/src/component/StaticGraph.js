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
const defaultGraph = "band";
const defaultQuery = "nodered/client/memory";

const style = {
  margin: "5px",
  height: "60%",
  width: "90%",
};
let animationFrameId = 0;
export default function StaticGraph({
  id,
  graphType,
  query,
  device,
  toggleLegend,
}) {
  const [graph, setGraph] = useState({
    table: {},
    lastUpdated: "",
    graphType: graphType,
    query: query,
    device: device,
  });

  const getDataAndUpdateTable = async () => {
    const resp = await axios.get(
      "http://localhost:3001/" + graph.device + "/" + graph.query
    );
    try {
      let results = fromFlux(resp.data.csv);
      let currentDate = new Date();
      setGraph((previousState) => {
        return {
          ...previousState,
          table: results.table,
          lastUpdated: currentDate.toLocaleTimeString(),
        };
      });
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
  }, []);

  useEffect(() => {
    return () => {
      window.clearInterval(animationFrameId);
    };
  }, []);
  
  const handleGraphChange = (event) => {
    setGraph((previousState) => {
      return { ...previousState, graphType: event.target.value };
    });
    localStorage.setItem("graph" + id, event.target.value);
    write(id, "graph", event.target.value);
  };

  const handleQueryChange = (event) => {
    setGraph((previousState) => {
      return { ...previousState, query: event.target.value };
    });
    localStorage.setItem("query" + id, event.target.value);
    write(id, "query", event.target.value);
  };

  const reset = () => {
    setGraph((previousState) => {
      return {
        ...previousState,
        graphType: "band",
        query: "nodered/client/memory",
      };
    });
    localStorage.setItem("graph", defaultGraph);
    localStorage.setItem("query", defaultQuery);
  };

  const renderPlot = () => {
    const fill = findStringColumns(graph.table);
    const config = {
      table: graph.table,
      layers: [new LayerConfig(graph.graphType, fill).getConfig()],
      valueFormatters: new DataFormatter(graph.query).getFormat(),
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
          <GraphForm onChange={handleGraphChange} graphType={graph.graphType} />
          <QueryForm onChange={handleQueryChange} query={graph.query} />
        </h2>
        <h5>Last Updated: {graph.lastUpdated}</h5>
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

  return Object.keys(graph.table).length > 0 ? renderPlot() : renderEmpty();
}
