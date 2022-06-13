import React from "react";
import GridLayout from "react-grid-layout";
import { Graph } from "./Graph";
import "../pages/Dashboard.css";

class TestGrid extends React.Component {
  render() {
    const defaultGraph = "band";
    const defaultQuery = "nodered/client/memory";
    const defaultDevice = "device1";
    // layout is an array of objects, see the demo for more complete usage
    const layout = [
      { i: "a", x: 0, y: 0, w: 1, h: 10, autoSize: true },
      { i: "b", x: 1, y: 0, w: 1, h: 10 },
    ];

    return (
      <GridLayout
        className="layout"
        layout={layout}
        cols={1}
        items={2}
        rowHeight={40}
        width={1}
        isBounded={false}
      >
        <div key="a">
          <Graph
            graphType={defaultGraph}
            device={defaultDevice}
            query={defaultQuery}
          />
        </div>

        <div key="b">
          <Graph
            graphType={defaultGraph}
            device={defaultDevice}
            query={defaultQuery}
          />
        </div>
      </GridLayout>
    );
  }
}
export default TestGrid;
