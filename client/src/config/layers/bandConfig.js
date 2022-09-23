import { NINETEEN_EIGHTY_FOUR } from "@influxdata/giraffe";
import { GraphType } from "../../constants";

export default function bandConfig(fill) {
  return {
    type: GraphType.BAND,
    x: "_time",
    y: "_value",
    fill: fill,
    colors: NINETEEN_EIGHTY_FOUR,
    interpolation: "monotoneX",
    lineWidth: 3,
    lineOpacity: 0.7,
    shadeOpacity: 0.3,
    hoverDimension: "auto",
    upperColumnName: "max",
    mainColumnName: "mean",
    lowerColumnName: "min",
  };
}
