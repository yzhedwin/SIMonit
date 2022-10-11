import { StaticMetric } from "../../constants";
import cpuFormat from "../data/cpuFormat";
import driveFormat from "../data/driveFormat";
import loadFormat from "../data/loadFormat";
import memFormat from "../data/memFormat";
import metricFormat from "../data/metricFormat";
import uptimeFormat from "../data/uptimeFormat";

//TODO: Add data formatting depending on data type
export default class DataFormatter {
  constructor(dataType, unit) {
    this.state = {
      dataType,
      unit,
    };
  }

  getFormat() {
    //get config of specified configtypes
    switch (StaticMetric[this.state.dataType.toUpperCase()]) {
      case StaticMetric.MEMORY:
        return memFormat;
      case StaticMetric.LOAD:
        return loadFormat;
      case StaticMetric.DRIVE:
        return driveFormat;
      case StaticMetric.UPTIME:
        return uptimeFormat;
      case StaticMetric.CPU:
        return cpuFormat;
      default:
        return metricFormat(this.state.unit);
    }
  }
}
