import { timeFormatter } from "@influxdata/giraffe";

const uptimeFormat = {
  _time: timeFormatter({
    timeFormat: "UTC",
    format: "HH:mm",
  }),
  _value: (val) => (typeof val === "number" ? `${val/1000}K` : val),
};
export default uptimeFormat;
