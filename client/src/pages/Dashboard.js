import React, { useState } from "react";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import "./Dashboard.css";
import { Button, ButtonGroup } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import write from "../component/DBWrite";
import {
  DEFAULT_DEVICE,
  DEFAULT_QUERY_1,
  DEFAULT_GRAPH_TYPE,
  DEFAULT_CPU,
  DEFAULT_DRIVE,
} from "../constants";
import { Main } from "../component/Drawer";
import Graph from "../component/Graph";

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
const storageCount = localStorage.getItem("dash_count") || 0;
const storageItems = localStorage.getItem("dash_items") || [];

export default function Dashboard({ openDrawer }) {
  const [layouts, setLayouts] = useState(
    JSON.parse(JSON.stringify(storageLayout))
  );
  const [items, setItems] = useState(JSON.parse(storageItems));
  const [count, setCount] = useState(JSON.parse(storageCount));
  const [toggleLegend, setToggleLegend] = useState(1);
  const [state, setState] = useState({ cols: {}, breakpoint: "" });

  //use index to load config of graph
  const generateDOM = (item) => {
    const toggle = toggleLegend || 1;
    let storageQuery =
      localStorage.getItem("dash_query" + (count + 1)) || DEFAULT_QUERY_1;
    let storageGraph =
      localStorage.getItem("dash_graph" + (count + 1)) || DEFAULT_GRAPH_TYPE;
    let storageDevice =
      localStorage.getItem("dash_device" + (count + 1)) || DEFAULT_DEVICE;
    let storageCPU =
      localStorage.getItem("dash_cpu" + (count + 1)) || DEFAULT_CPU;
    let storageDrive =
      localStorage.getItem("dash_drive" + (count + 1)) || DEFAULT_DRIVE;

    //TODO: Add database query to load config
    return (
      <div key={item.i} data-grid={item}>
        <Graph
          id={count + 1}
          inputGraphType={storageGraph}
          inputQuery={storageQuery}
          inputDevice={storageDevice}
          inputCPUID={storageCPU}
          inputDrive={storageDrive}
          toggleLegend={toggle}
          saveName={"dash"}
        />
      </div>
    );
  };

  //save to db
  const onLayoutChange = (layout, layouts) => {
    saveToLS("dash_layouts", layouts);
    setLayouts(layouts);
    if (items !== 0) {
      write("", "dash_layout", JSON.stringify(layouts));
    }
  };

  // const onItemsChange = (items, count) => {
  //   const newCount = count + 1;
  //   setCount(newCount);
  //   localStorage.setItem("dash_count", JSON.stringify(newCount));
  //   if (items !== 0) {
  //     write("", "dash_count", JSON.stringify(newCount));
  //   }
  // };

  const onBreakpointChange = (breakpoint, cols) => {
    setState({
      breakpoint: breakpoint,
      cols: cols,
    });
  };
  const onLegendChange = (num) => {
    const newNum = num * -1;
    setToggleLegend(newNum);
  };
  // const handleRemove = () => {
  //   setIsRemove(true);
  // };

  const onAddItem = () => {
    /*eslint no-console: 0*/
    const newItem = items.concat({
      // Add a new item. It must have a unique key!
      i: "n" + count,
      x: (count * 2) % (state.cols || 6),
      y: count, // puts it at the bottom
      w: 2,
      h: 20,
      minH: 20,
      minW: 1,
    });
    const newCount = count + 1;
    setItems(newItem);
    setCount(newCount);
    localStorage.setItem("dash_count", JSON.stringify(newCount));
    localStorage.setItem("dash_items", JSON.stringify(newItem));
  };

  const reset = () => {
    localStorage.clear();
    setLayouts({});
    setItems([]);
    setCount(0);
  };
  return (
    <Main
      openDrawer={openDrawer}
      className="dashboard"
      style={{
        marginTop: "50px",
        height: "100%",
      }}
    >
      <ButtonGroup
        variant="contained"
        aria-label="outlined primary button group"
      >
        <Button
          onClick={() => reset()}
          color="error"
          startIcon={<DeleteIcon />}
        >
          Reset All
        </Button>
        <Button
          onClick={() => onAddItem()}
          color="success"
          startIcon={<AddIcon />}
        >
          Graph
        </Button>
        <Button onClick={() => onLegendChange(toggleLegend)} color="warning">
          Toggle Legend
        </Button>
      </ButtonGroup>
      <ResponsiveReactGridLayout
        className="layout"
        cols={{ lg: 6, md: 5, sm: 4, xs: 3, xxs: 2 }}
        rowHeight={10}
        layouts={layouts}
        items={count}
        onLayoutChange={(layout, layouts) => onLayoutChange(layout, layouts)}
        isBounded={true}
        onBreakpointChange={onBreakpointChange}
        draggableHandle=".draghandle"
      >
        {_.map(items, (item) => generateDOM(item))}
      </ResponsiveReactGridLayout>
    </Main>
  );
}

/*
 if (process.env.STATIC_EXAMPLES === true) {
   import("../test-hook.jsx").then(fn => fn.default(BoundedLayout));
 }

*/
