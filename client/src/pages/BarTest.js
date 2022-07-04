import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./StaticPage.css";
import RGL, { WidthProvider } from "react-grid-layout";
import _ from "lodash";
import {
    DEFAULT_DEVICE,
    DEFAULT_QUERY_4,
} from "../constants";
import BarGraph from "../component/BarGraph";
 
const ReactGridLayout = WidthProvider(RGL);
function BarTest() {
  const { did } = useParams();
  const [layouts, setLayouts] = useState({});
  const items = 2;
  const queries = [DEFAULT_QUERY_4, DEFAULT_QUERY_4];
  const graphType = ["bar", "line"];

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
          <BarGraph
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
      cols={2}
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
export default BarTest;
