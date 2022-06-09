import React, { Component } from "react";
import { Graph } from "../component/Graph";

export default class StaticLegend extends Component {
  render() {
    return (
      <div>
        <Graph
          query="nodered/client/memory"
          graphType="band"
          device="device1"
        />
      </div>
    );
  }
}
