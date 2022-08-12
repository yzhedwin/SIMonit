import { DEFAULT_CPU } from "./constants";

export const findStringColumns = (table) =>
  table.columnKeys.filter((k) => table.getColumnType(k) === "string");

export function uriSelector(graphType, query, device) {
  return graphType.toLowerCase() === "band" && query.toLowerCase() === "memory"
    ? "/memory-band/" + device
    : query.toLowerCase() === "memory"
    ? "/memory/" + device
    : graphType.toLowerCase() === "band" && query.toLowerCase() === "drive"
    ? "/drive-band/" + device
    : query.toLowerCase() === "drive"
    ? "/drive/" + device
    : graphType.toLowerCase() === "band" && query.toLowerCase() === "load"
    ? "/load-band/" + device
    : query.toLowerCase() === "load"
    ? "/load/" + device
    : graphType.toLowerCase() === "band" && query.toLowerCase() === "cpu"
    ? "/cpu-band/" + device + "/" + DEFAULT_CPU
    : graphType.toLowerCase() === "bar" && query.toLowerCase() === "cpu"
    ? "/cpu/" + device + "/" + DEFAULT_CPU
    : graphType.toLowerCase() === "band" && query.toLowerCase() === "drive"
    ? "/drive-band/" + device
    : query.toLowerCase() === "drive"
    ? "/drive/" + device
    : graphType.toLowerCase() === "band" && query.toLowerCase() === "uptime"
    ? "/uptime-band/" + device
    : "/uptime/" + device;
}
