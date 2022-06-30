import cpuFormat from "../data/cpuFormat";
import driveFormat from "../data/driveFormat";
import loadFormat from "../data/loadFormat";
import memFormat from "../data/memFormat";
import uptimeFormat from "../data/uptimeFormat";

//TODO: Add data formatting depending on data type
export default class DataFormatter {
  constructor(dataType) {
    this.state = {
      dataType,
    };
  }

  getFormat() {
    //get config of specified configtype
    if (this.state.dataType.indexOf("memory") !== -1) {
      return memFormat;
    }
    if (this.state.dataType.indexOf("load") !== -1) {
      return loadFormat;
    }
    if (this.state.dataType.indexOf("uptime") !== -1) {
      return uptimeFormat;
    }
    if (this.state.dataType.indexOf("cpu") !== -1) {
      return cpuFormat;
    }
    if (this.state.dataType.indexOf("drive") !== -1) {
      return driveFormat;
    }
  }
}
