import bandConfig from "../layers/bandConfig";
import singleStatConfig from "../layers/singleStatConfig";
import gaugeConfig from "../layers/gaugeConfig";
import lineConfig from "../layers/lineConfig";
import barConfig from "../layers/barConfig";

/*
Filters the columns to be displayed on the graph
*/
function checkFills(fill) {
  return fill !== "topic";
}

export default class LayerConfig {
  constructor(configType, fill) {
    this.state = {
      configType,
      fill: fill.filter(checkFills),
    };
  }

  getConfig() {
    //get config of specified configtype
    if (this.state.configType === "band") {
      return bandConfig(this.state.fill);
    }  if (this.state.configType === "line") {
      return lineConfig(this.state.fill);
    }  if (this.state.configType === "single stat") {
      return singleStatConfig();
    } if (this.state.configType === "gauge") {
      return gaugeConfig();
    }  if (this.state.configType === "bar") {
      return barConfig(this.state.fill);
    } 
  }
}
