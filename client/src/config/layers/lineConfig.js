import { NINETEEN_EIGHTY_FOUR } from "@influxdata/giraffe";
//vary Value formatters
export default function lineConfig(fill) {
  return {
    type: "line",
    x: "_time",
    y: "_value",
    fill: fill,
    colors: NINETEEN_EIGHTY_FOUR,
    interpolation: "monotoneX",
    lineWidth: 3,
    lineOpacity: 0.7,
    shadeOpacity: 0.3,
    hoverDimension: "auto",
    mainColumnName: "last",
  };
}
