import React from "react";
import { useParams } from "react-router-dom";
import { Graph } from "../component/Graph";
import "./StaticPage.css";

function StaticPage() {
  const { did } = useParams();
  return (
    <div className="static-legend">
      <Graph
        query="nodered/client/memory"
        graphType="band"
        device={did || "device1"}
        toggleLegend={1}
      />
    </div>
  );
}
export default StaticPage;
