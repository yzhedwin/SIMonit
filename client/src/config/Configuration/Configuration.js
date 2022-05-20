export default class Configuration {
    Mapping = {
        'line': 'Line Layer',
        'gauge': 'Gauge Layer',
        'scatter': 'Scatter Layer',
        'single stat': 'Single Stat'
    }

    constructor(configType) {
        this.type = configType
    }

    getTitle() {
        return this.Mapping[this.type]
    }
}