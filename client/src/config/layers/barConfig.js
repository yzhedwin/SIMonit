import { NINETEEN_EIGHTY_FOUR } from "@influxdata/giraffe";

function checkFills(fill) {
  return fill !== "topic" &&
  fill !== "result" && 
  fill !== "filesystem";
}
export default function barConfig(fill) {
  return {
    type: 'histogram',
    x: '_value',
    fill: fill.filter(checkFills),
    colors: NINETEEN_EIGHTY_FOUR,
    position: "stacked",
    binCount: 5,
  };
}
