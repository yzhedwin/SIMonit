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
const storageItems = localStorage.getItem("dash_items") || 1;
export default function Dashboard({ openDrawer }) {
  const [layouts, setLayouts] = useState(
    JSON.parse(JSON.stringify(storageLayout))
  );
  const [items, setItems] = useState(JSON.parse(storageItems));
  const [toggleLegend, setToggleLegend] = useState(1);
  const [state, setState] = useState({ cols: {}, breakpoint: "" });

  //use index to load config of graph
  const generateDOM = () => {
    const cols = state.cols || 6;
    const toggle = toggleLegend || 1;
    //TODO: Add database query to load config
    return _.map(_.range(items), function (i) {
      let storageQuery =
        localStorage.getItem("dash_query" + (i + 1)) || DEFAULT_QUERY_1;
      let storageGraph =
        localStorage.getItem("dash_graph" + (i + 1)) || DEFAULT_GRAPH_TYPE;
      let storageDevice =
        localStorage.getItem("dash_device" + (i + 1)) || DEFAULT_DEVICE;
      let storageCPU =
        localStorage.getItem("dash_cpu" + (i + 1)) || DEFAULT_CPU;
      let storageDrive =
        localStorage.getItem("dash_drive" + (i + 1)) || DEFAULT_DRIVE;
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
          <Graph
            id={i + 1}
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
    setToggleLegend(newNum);
  };
  const reset = () => {
    localStorage.clear();
    localStorage.setItem("dash_items", JSON.stringify(0));
    setLayouts({});
    setItems(0);
  };

  //style={{transform: 'scale(0.75) translate(-15%, -15%)'}}>
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
          onClick={() => onItemsChange(items)}
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
        items={items}
        onLayoutChange={(layout, layouts) => onLayoutChange(layout, layouts)}
        isBounded={true}
        onBreakpointChange={onBreakpointChange}
        draggableHandle=".draghandle"
      >
        {generateDOM()}
      </ResponsiveReactGridLayout>
    </Main>
  );
}

/*
 if (process.env.STATIC_EXAMPLES === true) {
   import("../test-hook.jsx").then(fn => fn.default(BoundedLayout));
 }

*/
