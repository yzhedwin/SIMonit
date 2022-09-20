import { timeFormatter } from "@influxdata/giraffe";

const metricFormat = (unit) => {
  return {
    _time: timeFormatter({
      timeFormat: "UTC",
      format: "HH:mm",
    }),
    _value: (val) =>
      typeof val === "number"
        ? `${val.toFixed((1))}${unit.data[0]}`
        : val,
  };
};
export default metricFormat;
