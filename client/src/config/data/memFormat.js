import { timeFormatter } from "@influxdata/giraffe";

const memFormat = {
  _time: timeFormatter({
    timeFormat: "UTC",
    format: "HH:mm",
  }),
  _value: (val) => (typeof val === "number" ? `${val / 1000}KB` : val),
};

export default memFormat;
