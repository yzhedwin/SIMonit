import ethFormat from "../data/ethFormat";
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
    } else if (this.state.dataType.indexOf("eth") !== -1) {
      return ethFormat;
    } else if (this.state.dataType.indexOf("uptime") !== -1) {
      return uptimeFormat;
    }
  }
}
