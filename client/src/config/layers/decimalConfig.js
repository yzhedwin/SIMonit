import { NINETEEN_EIGHTY_FOUR } from "@influxdata/giraffe";

export default function decimalConfig(fill) {
  return {
    type: "single stat",
    x: "_time",
    y: "_value",
    fill: fill,
    colors: NINETEEN_EIGHTY_FOUR,
    interpolation: "monotoneX",
    lineWidth: 3,
    lineOpacity: 0.7,
    shadeOpacity: 0.3,
    hoverDimension: "auto",
  };

}
