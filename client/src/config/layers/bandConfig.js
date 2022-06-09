import { NINETEEN_EIGHTY_FOUR } from "@influxdata/giraffe";

export default function bandConfig(fill) {
  return {
    type: "band",
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
