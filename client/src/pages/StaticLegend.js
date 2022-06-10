import React, { Component } from "react";
import { Graph } from "../component/Graph";

export default class StaticLegend extends Component {
    style = {
        margin: "5px",
        height: "500px",
        width: "50%"
  };
  render() {
    return (
      <div style = {this.style}>
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
