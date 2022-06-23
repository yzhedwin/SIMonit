import React, { useState } from "react";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import "./Dashboard.css";
import { Button } from "@mui/material";
import write from "../component/DBWrite";
import {
  DEFAULT_DEVICE,
  DEFAULT_QUERY1,
  DEFAULT_GRAPH_TYPE,
} from "../constants";
import OptimisedGraph from "../component/OptimisedGraph";

//TODO: Load Layout and Items from Database
function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls[key];
}
function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(
      "rgl-8",
      JSON.stringify({
        [key]: value,
      })
    );
  }
}
const ResponsiveReactGridLayout = WidthProvider(Responsive);
//TODO: Migrate to loading from cloud Database
const storageLayout = getFromLS("dash_layouts") || {};
const storageItems = localStorage.getItem("dash_items") || 1;
export default function OptimisedDashboard(props) {
  const [layouts, setLayouts] = useState(
    JSON.parse(JSON.stringify(storageLayout))
  );
  const [items, setItems] = useState(JSON.parse(storageItems));
  const [toggleLegend, setToggelLegend] = useState(1);
  const [state, setState] = useState({ cols: {}, breakpoint: "" });

  //use index to load config of graph
  const generateDOM = () => {
    const cols = state.cols || 6;
    const toggle = toggleLegend || 1;
    //TODO: Add database query to load config
    return _.map(_.range(items), function (i) {
      let storageQuery =
        localStorage.getItem("dash_query" + (i + 1)) || DEFAULT_QUERY1;
      let storageGraph =
        localStorage.getItem("dash_graph" + (i + 1)) || DEFAULT_GRAPH_TYPE;
      let storageDevice =
        localStorage.getItem("dash_device" + (i + 1)) || DEFAULT_DEVICE;
      return (
        <div
          key={i}
          data-grid={{
            w: 2,
            h: 20,
            x: (i * 2) % cols,
            y: i,
            minH: 20,
            minW: 2,
            i: i.toString(),
          }}
        >
          <OptimisedGraph
            id={i + 1}
            inputGraphType={storageGraph}
            inputQuery={storageQuery}
            inputDevice={storageDevice}
            toggleLegend={toggle}
            saveName={"dash"}
          />
        </div>
      );
    });
  };
  //save to db
  const onLayoutChange = (layout, layouts) => {
    saveToLS("dash_layouts", layouts);
    setLayouts(layouts);
    if (items !== 0) {
      write("", "dash_layout", JSON.stringify(layouts));
    }
  };

  const onItemsChange = (items) => {
    const updateItem = items + 1;
    setItems(updateItem);
    localStorage.setItem("dash_items", JSON.stringify(updateItem));
    if (items !== 0) {
      write("", "dash_items", JSON.stringify(updateItem));
    }
  };
  const onBreakpointChange = (breakpoint, cols) => {
    setState({
      breakpoint: breakpoint,
      cols: cols,
    });
  };
  const onLegendChange = (num) => {
    const newNum = num * -1;
    setToggelLegend(newNum);
  };
  const reset = () => {
    localStorage.clear();
    localStorage.setItem("dash_items", JSON.stringify(0));
    setLayouts({});
    setItems(0);
  };

  //style={{transform: 'scale(0.75) translate(-15%, -15%)'}}>
  return (
    <div
      className="dashboard"
      style={{
        margin: "5px",
        height: "100%",
        width: "100%",
      }}
    >
      <h2>
        <Button onClick={() => reset()} variant="contained" color="error">
          Reset All
        </Button>
        <Button
          onClick={() => onItemsChange(items)}
          variant="contained"
          color="success"
        >
          Add Graph
        </Button>
        <Button
          onClick={() => onLegendChange(toggleLegend)}
          variant="contained"
          color="warning"
        >
          Toggle Legend
        </Button>
      </h2>
      <ResponsiveReactGridLayout
        className="layout"
        cols={{ lg: 6, md: 5, sm: 4, xs: 3, xxs: 2 }}
        rowHeight={10}
        layouts={layouts}
        items={items}
        onLayoutChange={(layout, layouts) => onLayoutChange(layout, layouts)}
        isBounded={true}
        onBreakpointChange={onBreakpointChange}
      >
        {generateDOM()}
      </ResponsiveReactGridLayout>
    </div>
  );
}

/*
 if (process.env.STATIC_EXAMPLES === true) {
   import("../test-hook.jsx").then(fn => fn.default(BoundedLayout));
 }

*/
