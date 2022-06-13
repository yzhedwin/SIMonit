import React, { Component } from "react";
import { Graph } from "../component/Graph";
import "./StaticLegend.css";

export default class StaticLegend extends Component {

  render() {
    return (
      <div className="static-legend">
        <Graph
          query="nodered/client/memory"
          graphType="band"
          device="device1"
          toggleLegend={1}
        />
      </div>
    );
  }
}
