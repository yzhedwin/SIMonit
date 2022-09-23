import bandConfig from "../layers/bandConfig";
import singleStatConfig from "../layers/singleStatConfig";
import gaugeConfig from "../layers/gaugeConfig";
import lineConfig from "../layers/lineConfig";
import barConfig from "../layers/barConfig";
import { GraphType } from "../../constants";

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
    switch (GraphType[this.state.configType]) {
      case GraphType.BAND:
        return bandConfig(this.state.fill);
      case GraphType.LINE:
        return lineConfig(this.state.fill);
      case GraphType.SINGLE_STAT:
        return singleStatConfig();
      case GraphType.GAUGE:
        return gaugeConfig();
      default:
        return barConfig(this.state.fill);
    }
  }
}
