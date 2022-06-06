import React from "react";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import "../Grid.css";
import { Graph } from "../component/Graph";
import { Button } from "@mui/material";
//import write from "../component/DBWrite"

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const storageLayout = getFromLS("layouts") || {};
const storageItems = localStorage.getItem("items") || 1;
const defaultGraph = 'band'
const defaultQuery ='nodered/client/memory'
const defaultDevice = 'device1'

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
    };
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.onItemsChange = this.onItemsChange.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
  }
  //use index to load config of graph
  generateDOM() {
    const cols = (this.state.cols || 6)
    
    return _.map(_.range(this.state.items), function (i) {
      const storageQuery = localStorage.getItem("query" + i) || defaultQuery;
      const storageGraph = localStorage.getItem("graph" + i) || defaultGraph;
      const storageDevice = localStorage.getItem("device" + i) || defaultDevice;
      return (
        <div
          key={i}
          data-grid={{
            w: 2,
            h: 15,
            x: (i*2) % cols,
            y: i,
            maxH: 20,
            minH: 15,
            minW: 2,
            i: i.toString(),
          }}
        >
          {<Graph 
          id={i} 
          graphType={storageGraph}
          query={storageQuery}
          device={storageDevice}
         />}
        </div>
      );
    });
  }
//save to db
  onLayoutChange(layout, layouts) {
    saveToLS("layouts", layouts);
    this.setState({ layouts });
  //  write('layout', JSON.stringify(layouts));
  }

  onItemsChange(items) {
    const updateItem = items + 1;
    this.setState({ items: updateItem });
    localStorage.setItem("items", JSON.stringify(updateItem));
   // write('quantity', JSON.stringify(updateItem));
  }
  
  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  }

  reset() {
    localStorage.clear()
    localStorage.setItem("items", JSON.stringify(0));
    this.setState({ layouts: {}, items: 0 });
  }

  //ADD Button
  render() {
    return (
      <div>
        <h2>
          <button onClick={() => this.reset()}>Reset All</button>
          <Button
            onClick={() => this.onItemsChange(this.state.items)}
            variant="contained"
            color="success"
          >
            Add Graph
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
