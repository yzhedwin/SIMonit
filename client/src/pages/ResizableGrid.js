import React from "react";
// import { Resizable } from "react-resizable";
// import Dashboard from "./Dashboard";
import { Responsive, WidthProvider } from "react-grid-layout";
import Dashboard from "./Dashboard";
import "./Dashboard.css";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const storageLayout = getFromLS("GridLayouts") || {};

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

export default class ResizableGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layouts: JSON.parse(JSON.stringify(storageLayout)),
    };
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
  }
  onLayoutChange(layout, layouts) {
    saveToLS("layouts", layouts);
    this.setState({ layouts });
    // if (this.state.items !== 0) {
    //   write("", "layout", JSON.stringify(layouts));
    // }
  }
  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols,
    });
  }
  render() {

    return (
      <div>
        <h3>Resizable Div</h3>
        <ResponsiveReactGridLayout
          className="dashboard-layout"
          cols={{ lg: 6, md: 5, sm: 4, xs: 3, xxs: 2 }}
          layouts={this.state.layouts}
          isBounded={true}
          isDraggable={false}
          onLayoutChange={(layout, layouts) =>
            this.onLayoutChange(layout, layouts)
          }
          onBreakpointChange={this.onBreakpointChange}
        >
          <div key="1" data-grid={{ w: 3, h: 3, x: 0, y: 0, minW: 3, minH: 3 }}>
            <Dashboard/>
          </div>
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}
// eslint-disable-next-line no-lone-blocks
/* 
  state = {
    width: 500,
    height: 500,
    absoluteWidth: 200,
    absoluteHeight: 200,
    absoluteLeft: 0,
    absoluteTop: 0,
  };

  onResetClick = () => {
    this.setState({
      width: 500,
      height: 500,
    });
  };

  // On top layout
  onFirstBoxResize = (event, { element, size, handle }) => {
    this.setState({ width: size.width, height: size.height });
  };

  // On bottom layout. Used to resize the center element around its flex parent.
  onResizeAbsolute = (event, { element, size, handle }) => {
    this.setState((state) => {
      let newLeft = state.absoluteLeft;
      let newTop = state.absoluteTop;
      const deltaHeight = size.height - state.absoluteHeight;
      const deltaWidth = size.width - state.absoluteWidth;
      if (handle[0] === "n") {
        newTop -= deltaHeight;
      } else if (handle[0] === "s") {
        newTop += deltaHeight;
      }
      if (handle[handle.length - 1] === "w") {
        newLeft -= deltaWidth;
      } else if (handle[handle.length - 1] === "e") {
        newLeft += deltaWidth;
      }

      return {
        absoluteWidth: size.width,
        absoluteHeight: size.height,
        absoluteLeft: newLeft,
        absoluteTop: newTop,
      };
    });
  };


<Resizable
className="box"
height={this.state.height}
width={this.state.width}
onResize={this.onFirstBoxResize}
resizeHandles={["sw", "se", "nw", "ne", "w", "e", "n", "s"]}
>
<div
  style={{
    width: this.state.width + "px",
    height: this.state.height + "px",
  }}
>
  <div
    style={{
      margin: "5px",
      height: "100%",
      width: "100%",
    }}
  >
    <Dashboard />
  </div>
</div>
</Resizable> */
