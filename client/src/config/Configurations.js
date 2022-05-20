import BandConfig from './BandLayer/BandConfig'


const Configurations = {
    get() {
        return [
            //new LineLayerConfig(),
          //  new ScatterLayerConfig(),
          //  new GaugeLayerConfig(),
           // new HeatMapLayerConfig(),
            new BandConfig(),
           // new SingleStatLayerConfig(),
          //  new HistogramLayerConfig(),
         //   new TableLayerConfig(),
        ]
    }
}
export default Configurations
