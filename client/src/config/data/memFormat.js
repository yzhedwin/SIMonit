import { timeFormatter } from "@influxdata/giraffe";

const memFormat = {
  _time: timeFormatter({
    timeFormat: "UTC",
    format: "HH:mm",
  }),
  _value: (val) => (typeof val === "number" ? `${(val / 1000000).toFixed(1)}MB` : val),
};

export default memFormat;
