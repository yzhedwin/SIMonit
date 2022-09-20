import React, { useState } from "react";
import { useParams } from "react-router-dom";
import StaticGraph from "../component/StaticGraph";
import RGL, { WidthProvider } from "react-grid-layout";
import _ from "lodash";
import {
  DEFAULT_DEVICE,
  DEFAULT_DRIVE,
  DEFAULT_QUERY_1,
  DEFAULT_QUERY_2,
  DEFAULT_QUERY_3,
  DEFAULT_QUERY_4,
} from "../constants";
 
const ReactGridLayout = WidthProvider(RGL);
function StaticPage() {
  const { did } = useParams();
  const [layouts, setLayouts] = useState({});
  const items = 4;
  const queries = [DEFAULT_QUERY_1, DEFAULT_QUERY_2, DEFAULT_QUERY_3, DEFAULT_QUERY_4];
  const graphType = ["line", "line", "line", "bar"];
  const cpu = 0;
  const drive = DEFAULT_DRIVE;

  const onLayoutChange = (layout, layouts) => {
    setLayouts(layouts);
  };

  let generateDOM = () => {
    return _.map(_.range(items), function (i) {
      return (
        <div
        className="static-grid-item"
          key={i}
          data-grid={{
            w: 1,
            h: 25,
            x: i,
            y: i,
            i: i.toString(),
          }}
        >
          <StaticGraph
            device={did || DEFAULT_DEVICE}
            graphType={graphType[i]}
            query={queries[i]}
            toggleLegend={1}
            cpu={cpu}
            drive={drive}
          />
        </div>
      );
    });
  };
  return (
    <ReactGridLayout
      style={{backgroundColor:"white", marginTop: 0}}
      cols={4}
      rowHeight={4}
      layouts={layouts}
      isDraggable={false}
      isResizable={false}
      onLayoutChange={(layout, layouts) => onLayoutChange(layout, layouts)}
    >
      {generateDOM()}
    </ReactGridLayout>
  );
}
export default StaticPage;
