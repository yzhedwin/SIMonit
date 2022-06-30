import { timeFormatter } from "@influxdata/giraffe";

const cpuFormat = {
  _time: timeFormatter({
    timeFormat: "UTC",
    format: "HH:mm",
  }),
  _value: (val) => (typeof val === "number" ? `${val}` : val),
};
export default cpuFormat;
