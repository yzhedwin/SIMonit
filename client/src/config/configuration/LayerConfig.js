import bandConfig from "../layers/bandConfig";
import decimalConfig from "../layers/decimalConfig";
import gaugeConfig from "../layers/gaugeConfig";
import lineConfig from "../layers/lineConfig";

//TODO: Add data formatting depending on data type
export default class LayerConfig {
  constructor(configType, fill) {
    this.state = {
      configType,
      fill,
    };
  }

  getConfig() {
    //get config of specified configtype
    if (this.state.configType === "band") {
      return bandConfig(this.state.fill);
    } else if (this.state.configType === "line") {
      return lineConfig(this.state.fill);
    } else if (this.state.configType === "single stat") {
      return decimalConfig(this.state.fill);
    } else if (this.state.configType === "gauge") {
      return gaugeConfig();
    } 
  }
}
