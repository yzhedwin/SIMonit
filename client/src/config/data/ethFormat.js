import { timeFormatter } from "@influxdata/giraffe";

const ethFormat = {
  _time: timeFormatter({
    timeFormat: "UTC",
    format: "HH:mm",
  }),
  _value: (val) => (typeof val === "number" ? `${val/2000}K` : val),
};
export default ethFormat;
