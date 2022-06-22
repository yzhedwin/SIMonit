import React, { useState } from "react";
import { useParams } from "react-router-dom";
import StaticGraph from "../component/StaticGraph";
import "./StaticPage.css";
import { Responsive, WidthProvider } from "react-grid-layout";
import _ from "lodash";
import { DEFAULT_QUERY1, DEFAULT_QUERY2, DEFAULT_QUERY3 } from "../constants";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
function StaticPage() {
  const { did } = useParams();
  const [state, setState] = useState({ cols: {}, breakpoint: "" });
  const [layouts, setLayouts] = useState({});
  const items = 3;
  const querySelect = [DEFAULT_QUERY1, DEFAULT_QUERY2, DEFAULT_QUERY3];
  const graphType = ["band", "line", "single stat"];

  const onBreakpointChange = (breakpoint, cols) => {
    setState({
      breakpoint: breakpoint,
      cols: cols,
    });
  };
  const onLayoutChange = (layout, layouts) => {
    setLayouts(layouts);
  };
  let generateDOM = () => {
    return _.map(_.range(items), function (i) {
      return (
        <div
          key={i}
          data-grid={{
            w: 2,
            h: 20,
            x: i * 2,
            y: i,
            i: i.toString(),
          }}
        >
          <StaticGraph
            id={i}
            device={did || "device1"}
            graphType={graphType[i]}
            query={querySelect[i]}
            toggleLegend={1}
          />
        </div>
      );
    });
  };
  return (
    <div className="static-legend">
      <h2>{did || "Device 1"}</h2>
      <ResponsiveReactGridLayout
        className="layout"
        cols={{ lg: 6, md: 5, sm: 4, xs: 3, xxs: 2 }}
        rowHeight={20}
        layouts={layouts}
        isDraggable={false}
        isResizable={false}
        onBreakpointChange={onBreakpointChange}
        onLayoutChange={(layout, layouts) => onLayoutChange(layout, layouts)}
      >
        {generateDOM()}
      </ResponsiveReactGridLayout>
    </div>
  );
}
export default StaticPage;
