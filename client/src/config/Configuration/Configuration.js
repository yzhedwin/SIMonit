import bandConfig from "../layers/bandConfig"
import decimalConfig from "../layers/decimalConfig";
import lineConfig from "../layers/lineConfig";

//TODO: Add data formatting depending on data type
export default class Configuration {

    constructor(configType, table, fill) {
        this.state = {
            configType,
            table,
            fill
        };
    }

    getConfig() {
        //get config of specified configtype
        if (this.state.configType === 'band') {
            return bandConfig(this.state.table, this.state.fill)
        } else if (this.state.configType === 'line') {
            return lineConfig(this.state.table, this.state.fill)
        } else if (this.state.configType === 'single stat') {
            return decimalConfig(this.state.table, this.state.fill)
        }
    }
}