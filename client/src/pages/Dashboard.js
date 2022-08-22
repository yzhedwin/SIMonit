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

export default function Dashboard({ openDrawer }) {
const storageLayout = getFromLS("dash_layouts") || {};
const storageCount =  JSON.parse(localStorage.getItem("dash_count")) || 0;
const storageItems = JSON.parse(localStorage.getItem("dash_items")) || [];

const [layouts, setLayouts] = useState(
    JSON.parse(JSON.stringify(storageLayout))
  );
  const [items, setItems] = useState(storageItems);
  const [count, setCount] = useState(storageCount);
  const [toggleLegend, setToggleLegend] = useState(1);
  const [state, setState] = useState({ cols: {}, breakpoint: "" });

  //use index to load config of graph
  const generateDOM = (item) => {
    const toggle = toggleLegend || 1;
    let storageQuery =
      localStorage.getItem("dash_query_" + item.i) || DEFAULT_QUERY_1;
    let storageGraph =
      localStorage.getItem("dash_graph_" + item.i) || DEFAULT_GRAPH_TYPE;
    let storageDevice =
      localStorage.getItem("dash_device_" + item.i) || DEFAULT_DEVICE;
    let storageCPU =
      localStorage.getItem("dash_cpu_" + item.i) || DEFAULT_CPU;
    let storageDrive =
      localStorage.getItem("dash_drive_" + item.i) || DEFAULT_DRIVE;

    //TODO: Add database query to load config
    return (
      <div key={item.i} data-grid={item}>
        <Graph
          id={item.i}
          inputGraphType={storageGraph}
          inputQuery={storageQuery}
          inputDevice={storageDevice}
          inputCPUID={storageCPU}
          inputDrive={storageDrive}
          toggleLegend={toggle}
          saveName={"dash"}
          handleRemoveItem={() => onRemoveItem(item.i)}
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

  const onAddItem = () => {
    const newItem = items.concat({
      // Add a new item. It must have a unique key!
      i: "n" + count,
      x: (count * 2) % (state.cols || 6),
      y: count,
      w: 2,
      h: 20,
      minH: 15,
      minW: 2,
    });
    const newCount = count + 1;
    setItems(newItem);
    setCount(newCount);
    localStorage.setItem("dash_count", JSON.stringify(newCount));
    localStorage.setItem("dash_items", JSON.stringify(newItem));
  };
  const onRemoveItem = (i) => {
    console.log("removing", i);
    const index = items.findIndex((item) => item.i === i);
    let newItems = items;
    newItems.splice(index, 1)
    const newCount = count - 1;
    setItems(newItems);
    setCount(newCount);
    localStorage.setItem("dash_count", JSON.stringify(newCount));
    localStorage.setItem("dash_items", JSON.stringify(newItems));
  }

  const reset = () => {
    setLayouts({});
    setItems([]);
    setCount(0);
    localStorage.clear();

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
        size="small"
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
