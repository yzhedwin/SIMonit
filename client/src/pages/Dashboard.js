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
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { Main } from "../component/Drawer";
import FormDialog from "../component/FormDialog";
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
    let storageGraph = JSON.parse(
      localStorage.getItem("dash_graph_" + item.i) || "{}"
    );
    let storageList = JSON.parse(
      localStorage.getItem("dash_list_" + item.i) || "{}"
    );

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
            <Graph
              id={item.i}
              graph={storageGraph}
              list={storageList}
              toggleLegend={toggle}
              saveName={"dash"}
            />
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
          x: (index * 2) % (Object.keys(state.cols).length === 0 ? 6 : state.cols),
          y: index,
          w: 2,
          h: 20,
          minH: 15,
          minW: 1,
        };
        break;
      }
    }
    //No gap found, add item as per normal
    if (index === items.length) {

      newItem = {
        // Add a new item. It must have a unique key!
        i: index.toString(),
        x: (index * 2) % (Object.keys(state.cols).length === 0 ? 6 : state.cols),
        y: Infinity,
        w: 2,
        h: 20,
        minH: 15,
        minW: 1,
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
    const newSave = { ...save, [name]: { items: items, count: count } };
    setSave(newSave);
    localStorage.setItem("dash_layouts", JSON.stringify(newSave));
  };
  //TODO: Load Layout (menu select layout and set all states)

  const onLoadLayout = (name) => {
    console.log(name)
  }
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
        marginTop: "69px",
      }}
    >
      <div className="dashboard-container">
        <div className="dashboard-menu">
          <ButtonGroup
            variant="contained"
            orientation="horizontal"
            aria-label="outlined primary button group"
          >
            <Tooltip title="Add Graph">
              <Button onClick={() => onAddItem()} color="success">
                <AddIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Show/Hide Legend">
              <Button
                onClick={() => onLegendChange(toggleLegend)}
                color="warning"
              >
                <LegendToggleIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Reset All">
              <Button onClick={() => reset()} color="error">
                <DeleteIcon />
              </Button>
            </Tooltip>
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
