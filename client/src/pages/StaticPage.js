import React from "react";
import { useParams } from "react-router-dom";
import StaticGraph from "../component/StaticGraph";
import "./StaticPage.css";

function StaticPage() {
  const { did } = useParams();
  return (
    <div className="static-legend">
      {StaticGraph(
        {
        id: 1,
        device: did || "device1",
        toggleLegend: -1
      })
    }
    </div>
  );
}
export default StaticPage;
