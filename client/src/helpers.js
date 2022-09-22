export const findStringColumns = (table) =>
  table.columnKeys.filter((k) => table.getColumnType(k) === "string");

export function uriSelector(graphType, query, device, cpu, drive) {
  return graphType.toLowerCase() === "band" && query.toLowerCase() === "memory"
    ? `/memory-band/${device}`
    : query.toLowerCase() === "memory"
    ? `/memory/${device}`
    : graphType.toLowerCase() === "band" && query.toLowerCase() === "load"
    ? `/load-band/${device}`
    : query.toLowerCase() === "load"
    ? `/load/${device}`
    : graphType.toLowerCase() === "band" && query.toLowerCase() === "cpu"
    ? `/cpu-band/${device}/${cpu}`
    : graphType.toLowerCase() === "bar" && query.toLowerCase() === "cpu"
    ? `/cpu/${device}/${cpu}`
    : graphType.toLowerCase() === "band" && query.toLowerCase() === "drive"
    ? `/drive-band/${device}?mount=${drive}`
    : query.toLowerCase() === "drive"
    ? `/drive/${device}?mount=${drive}`
    : graphType.toLowerCase() === "band" && query.toLowerCase() === "uptime"
    ? `/uptime-band/${device}`
    : `/uptime/${device}`;
}
