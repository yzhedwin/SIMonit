import { GraphType, StaticMetric } from "./constants";

export const findStringColumns = (table) =>
  table.columnKeys.filter((k) => table.getColumnType(k) === "string");

export function uriSelector(graphType, query, device, cpu, drive) {
  switch (GraphType[graphType]) {
    case GraphType.BAND:
      switch (StaticMetric[query]) {
        case StaticMetric.MEMORY:
          return `/memory-band/${device}`;
        case StaticMetric.LOAD:
          return `/load-band/${device}`;
        case StaticMetric.DRIVE:
          return `/drive-band/${device}?mount=${drive}`;
        case StaticMetric.CPU:
          return `/cpu-band/${device}/${cpu}`;
        default:
          return `/uptime-band/${device}`;
      }
    default:
      switch (StaticMetric[query]) {
        case StaticMetric.MEMORY:
          return `/memory/${device}`;
        case StaticMetric.LOAD:
          return `/load/${device}`;
        case StaticMetric.DRIVE:
          return `/drive/${device}?mount=${drive}`;
        case StaticMetric.CPU:
          return `/cpu/${device}/${cpu}`;
        default:
          return `/uptime-band/${device}`;
      }
  }
}
