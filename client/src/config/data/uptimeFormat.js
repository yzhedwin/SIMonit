import { timeFormatter } from "@influxdata/giraffe";

const uptimeFormat = {
  _time: timeFormatter({
    timeFormat: "UTC",
    format: "HH:mm",
  }),
  _value: (val) => (typeof val === "number" ? ` ${((val/3600) % 60).toFixed(0)}Hr ${((val/60)%60).toFixed(0)}Min ${((val%60).toFixed(0))}S` : val),
};
export default uptimeFormat;
