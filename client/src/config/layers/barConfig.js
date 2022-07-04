import { NINETEEN_EIGHTY_FOUR } from "@influxdata/giraffe";

export default function barConfig(fill) {
  return {
    type: 'histogram',
    x: '_value',
    fill: fill,
    colors: NINETEEN_EIGHTY_FOUR,
    position: "stacked",
    binCount: 5,
  };
}
