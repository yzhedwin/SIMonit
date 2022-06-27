import React, { useState } from "react";
import { useParams } from "react-router-dom";
import StaticGraph from "../component/StaticGraph";
import "./StaticPage.css";
import RGL, { WidthProvider } from "react-grid-layout";
import _ from "lodash";
import {
  DEFAULT_DEVICE,
  DEFAULT_QUERY1,
  DEFAULT_QUERY2,
  DEFAULT_QUERY3,
} from "../constants";

const ReactGridLayout = WidthProvider(RGL);
function StaticPage() {
  const { did } = useParams();
  const [state, setState] = useState({ cols: {}, breakpoint: "" });
  const [layouts, setLayouts] = useState({});
  const items = 4;
  const queries = [DEFAULT_QUERY1, DEFAULT_QUERY2, DEFAULT_QUERY3, DEFAULT_QUERY3];
  const graphType = ["band", "line", "line", "single stat"];

  const onLayoutChange = (layout, layouts) => {
    setLayouts(layouts);
  };
  let generateDOM = () => {
    return _.map(_.range(items), function (i) {
      return (
        <div
          key={i}
          data-grid={{
            w: 1,
            h: 25,
            x: i,
            y: i,
            i: i.toString(),
          }}
        >
          <StaticGraph
            id={i}
            device={did || DEFAULT_DEVICE}
            graphType={graphType[i]}
            query={queries[i]}
            toggleLegend={1}
          />
        </div>
      );
    });
  };
  return (
    <ReactGridLayout
      className="static"
      style={{
        background: "white",
        border: "1px solid white"
      }}
      cols={4}
      rowHeight={4}
      layouts={layouts}
      isDraggable={false}
      isResizable={false}
      onLayoutChange={(layout, layouts) => onLayoutChange(layout, layouts)}
    >
      {generateDOM()}
    </ReactGridLayout>
  );
}
export default StaticPage;
