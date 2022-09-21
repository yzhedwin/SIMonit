export const findStringColumns = (table) =>
  table.columnKeys.filter((k) => table.getColumnType(k) === "string");

export function uriSelector(graphType, query, device, cpu, drive) {
  return  query.toLowerCase() === "memory"
    ? `/memory/${device}`
    : query.toLowerCase() === "load"
    ? `/load/${device}`
    : graphType.toLowerCase() === "bar" && query.toLowerCase() === "cpu"
    ? `/cpu/${device}/${cpu}`
    : query.toLowerCase() === "drive"
    ? `/drive/${device}?mount=${drive}`
    : `/uptime/${device}`;
}
