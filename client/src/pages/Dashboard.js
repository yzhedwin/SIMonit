import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import LegendToggleIcon from "@mui/icons-material/LegendToggle";
import { Button, ButtonGroup } from "@mui/material";
import _ from "lodash";
import React, { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
//import write from "../component/DBWrite";
import AppsIcon from "@mui/icons-material/Apps";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import Zoom from "@mui/material/Zoom";
import { Main } from "../component/Drawer";
import Graph from "../component/Graph";
import { DEFAULT_GATEWAY, DEFAULT_GRAPH_TYPE } from "../constants";
import FormDialog from "../component/FormDialog";

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

export default function Dashboard({ openDrawer }) {
  const storageLayout = getFromLS("dash_layouts") || {};
  const storageCount = JSON.parse(localStorage.getItem("dash_count")) || 0;
  const storageItems = JSON.parse(localStorage.getItem("dash_items")) || [];
  const storageSave = JSON.parse(localStorage.getItem("dash_layouts")) || {};

  // JSON parses Infinity to null which will return
  // "ReactGridLayout.children[0].y must be a number"
  if (storageItems.size !== 0) {
    storageItems.forEach((item) => {
      if (item.y === null) {
        item.y = Infinity;
      }
    });
  }
  const [layouts, setLayouts] = useState(
    JSON.parse(JSON.stringify(storageLayout))
  );
  const [toggleLegend, setToggleLegend] = useState(1);
  const [state, setState] = useState({ cols: {}, breakpoint: "" });
  const [items, setItems] = useState(storageItems);
  const [count, setCount] = useState(storageCount);
  const [save, setSave] = useState(storageSave);

  //use index to load config of graph
  const generateDOM = (item) => {
    const toggle = toggleLegend || 1;
    let storageMetric =
      JSON.parse(localStorage.getItem("dash_metric_" + item.i)) || "";
    let storageGraph =
      localStorage.getItem("dash_graph_" + item.i) || DEFAULT_GRAPH_TYPE;
    let storageDevice =
      JSON.parse(localStorage.getItem("dash_device_" + item.i)) || "";
    let storageGateway = JSON.parse(
      localStorage.getItem("dash_gateway_" + item.i) || DEFAULT_GATEWAY
    );
    let storageGatewayList = JSON.parse(
      localStorage.getItem("dash_gatewayList_" + item.i)
    ) || [{}];
    let storageDeviceList = JSON.parse(
      localStorage.getItem("dash_deviceList_" + item.i)
    ) || [{}];
    let storageMetricList = JSON.parse(
      localStorage.getItem("dash_metricList_" + item.i)
    ) || [{}];

    //TODO: Add database query to load config
    const delay = item.i * 100;
    return (
      <div key={item.i} data-grid={item} className="dashgrid">
        <Zoom
          in={true}
          style={{ transitionDelay: `${delay}ms` }}
          timeout={1000}
        >
          <div className="itemcontainer">
            <div className="removebutton" onClick={() => onRemoveItem(item.i)}>
              <DisabledByDefaultIcon color="error" />
            </div>
            <div className="draghandle">
              <AppsIcon />
            </div>
            {/* <Graph
              id={item.i}
              graphType={storageGraph}
              metric={storageMetric}
              metricList={storageMetricList}
              device={storageDevice}
              deviceList={storageDeviceList}
              gateway={storageGateway}
              gatewayList={storageGatewayList}
              toggleLegend={toggle}
              saveName={"dash"}
            /> */}
          </div>
        </Zoom>
      </div>
    );
  };

  //save to db
  const onLayoutChange = (layout, layouts) => {
    saveToLS("dash_layouts", layouts);
    setLayouts(layouts);
    // if (items !== 0) {
    //   write("", "dash_layout", JSON.stringify(layouts));
    // }
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
    let newItem;
    let index = 0;
    while (index < items.length) {
      if (items[index].i === index.toString()) {
        index++;
        //Set item at gap of array
      } else {
        newItem = {
          i: index.toString(),
          x: (index * 2) % (state.cols || 6),
          y: index,
          w: 2,
          h: 20,
          minH: 15,
          minW: 2,
        };
        break;
      }
    }
    //No gap found, add item as per normal
    if (index === items.length) {
      newItem = {
        // Add a new item. It must have a unique key!
        i: index.toString(),
        x: (index * 2) % (state.cols || 6),
        y: Infinity,
        w: 2,
        h: 20,
        minH: 15,
        minW: 2,
      };
      items.push(newItem);
      //Insert item at gap
    } else {
      items.splice(index, 0, newItem);
    }
    setItems(items);
    setCount(items.length);
    localStorage.setItem("dash_count", JSON.stringify(items.length));
    localStorage.setItem("dash_items", JSON.stringify(items));
  };
  const onRemoveItem = (i) => {
    console.log(items);
    items.forEach((item, index) => {
      if (item.i === i.toString()) {
        items.splice(index, 1);
      }
    });
    const newCount = count - 1;
    setItems(items);
    setCount(newCount);
    localStorage.setItem("dash_count", JSON.stringify(newCount));
    localStorage.setItem("dash_items", JSON.stringify(items));
  };

  const onSaveLayout = (name) => {
    const newSave = { ...save, [name]: items };
    setSave(newSave);
    localStorage.setItem("dash_layouts", JSON.stringify(newSave));
  };
  //TODO: Load Layout
  //Remove Layout

  const reset = () => {
    setLayouts({});
    setItems([]);
    setCount(0);
    localStorage.clear();
  };
  return (
    //Add layouts
    <Main
      open={openDrawer}
      className="dashboard"
      style={{
        padding: 0,
        marginTop: "70px",
      }}
    >
      <div className="dashboard-container">
        <div className="layout-menu">
          <ButtonGroup
            variant="contained"
            orientation="vertical"
            aria-label="outlined primary button group"
          >
            <Button onClick={() => onAddItem()} color="success">
              <AddIcon />
            </Button>
            <Button
              onClick={() => onLegendChange(toggleLegend)}
              color="warning"
            >
              <LegendToggleIcon />
            </Button>
            <Button onClick={() => reset()} color="error">
              <DeleteIcon />
            </Button>
            <FormDialog onSave={(name) => onSaveLayout(name)} />
          </ButtonGroup>
        </div>
        <div className="rgl-container">
          <ResponsiveReactGridLayout
            className="layout"
            cols={{ lg: 6, md: 5, sm: 4, xs: 3, xxs: 2 }}
            rowHeight={10}
            layouts={layouts}
            isBounded={true}
            draggableHandle=".draghandle"
            useCSSTransforms={true}
            onBreakpointChange={onBreakpointChange}
            onLayoutChange={(layout, layouts) =>
              onLayoutChange(layout, layouts)
            }
          >
            {_.map(items, (item) => generateDOM(item))}
          </ResponsiveReactGridLayout>
        </div>
      </div>
    </Main>
  );
}
