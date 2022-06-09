import React from "react";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import "../Grid.css";
import { Graph } from "../component/Graph";
import { Button } from "@mui/material";
import write from "../component/DBWrite";

//TODO: Load Layout and Items from Database
const ResponsiveReactGridLayout = WidthProvider(Responsive);
const storageLayout = getFromLS("layouts") || {};
const storageItems = localStorage.getItem("items") || 1;
const defaultGraph = "band";
const defaultQuery = "nodered/client/memory";
const defaultDevice = "device1";

export default class Grid extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    cols: { lg: 6, md: 5, sm: 4, xs: 3, xxs: 2 },
    rowHeight: 30,
  };

  constructor(props) {
    super(props);
    this.state = {
      layouts: JSON.parse(JSON.stringify(storageLayout)),
      items: JSON.parse(storageItems),
      toggleLegend: 1
    };
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.onItemsChange = this.onItemsChange.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onLegendChange = this.onLegendChange.bind(this);
  }
  //use index to load config of graph
  generateDOM() {
    const cols = this.state.cols || 6;
    const toggle = this.state.toggleLegend || 1;
    //TODO: Add database query to load config
    return _.map(_.range(this.state.items), function (i) {
      let storageQuery =
        localStorage.getItem("query" + (i + 1)) || defaultQuery;
      let storageGraph =
        localStorage.getItem("graph" + (i + 1)) || defaultGraph;
      let storageDevice =
        localStorage.getItem("device" + (i + 1)) || defaultDevice;
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
          {
            <Graph
              id={i + 1}
              graphType={storageGraph}
              query={storageQuery}
              device={storageDevice}
              toggleLegend={toggle}
            />
          }
        </div>
      );
    });
  }
  //save to db
  onLayoutChange(layout, layouts) {
    saveToLS("layouts", layouts);
    this.setState({ layouts });
    if (this.state.items !== 0) {
      write("", "layout", JSON.stringify(layouts));
    }
  }

  onItemsChange(items) {
    const updateItem = items + 1;
    this.setState({ items: updateItem });
    localStorage.setItem("items", JSON.stringify(updateItem));
    if (this.state.items !== 0) {
      write("", "quantity", JSON.stringify(updateItem));
    }
  }
  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols,
    });
  }
  onLegendChange(num) {
    const newNum = num * -1;
    this.setState({ toggleLegend: newNum});
  }

  reset() {
    localStorage.clear();
    localStorage.setItem("items", JSON.stringify(0));
    this.setState({ layouts: {}, items: 0 });
  }

  render() {
    return (
      <div>
        <h2>
          <Button 
          onClick={() => this.reset()}
          variant="contained"
          color="error"
          >Reset All
          </Button>
          <Button
            onClick={() => this.onItemsChange(this.state.items)}
            variant="contained"
            color="success"
          >
            Add Graph
          </Button>
          <Button
            onClick={() => this.onLegendChange(this.state.toggleLegend)}
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
          layouts={this.state.layouts}
          items={this.state.items}
          onLayoutChange={(layout, layouts) =>
            this.onLayoutChange(layout, layouts)
          }
          onBreakpointChange={this.onBreakpointChange}
        >
          {this.generateDOM()}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}
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

// if (process.env.STATIC_EXAMPLES === true) {
//   import("../test-hook.jsx").then(fn => fn.default(BoundedLayout));
// }
