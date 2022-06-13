import React from "react";
import { fromFlux, Plot } from "@influxdata/giraffe";
import axios from "axios";
import { findStringColumns } from "../helpers";
import DeviceForm from "../forms/DeviceForm";
import GraphForm from "../forms/GraphForm";
import QueryForm from "../forms/QueryForm";
import write from "./DBWrite";
import LayerConfig from "../config/configuration/LayerConfig";
import DataFormatter from "../config/configuration/DataFormatter";

const REASONABLE_API_REFRESH_RATE = 5000;
const defaultGraph = "band";
const defaultQuery = "nodered/client/memory";
const defaultDevice = "device1";

export class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      table: {},
      lastUpdated: "",
      graphType: props.graphType,
      query: props.query,
      device: props.device,
    };
    this.handleGraphChange = this.handleGraphChange.bind(this);
    this.handleDeviceChange = this.handleDeviceChange.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
  }

  animationFrameId = 0;
  style = {
    margin: "5px",
    height: "60%",
    width: "90%",
  };

  getDataAndUpdateTable = async () => {
    const resp = await axios.get("http://localhost:3001/" + this.state.query);
    try {
      let results = fromFlux(resp.data.csv);
      let currentDate = new Date();
      this.setState({
        table: results.table,
        lastUpdated: currentDate.toLocaleTimeString(),
      });
    } catch (error) {
      console.error("error", error.message);
    }
  };

  async componentDidMount() {
    try {
      this.getDataAndUpdateTable();
      this.animationFrameId = window.setInterval(
        this.getDataAndUpdateTable,
        REASONABLE_API_REFRESH_RATE
      );
    } catch (error) {
      console.error(error);
    }
  }

  componentWillUnmount = () => {
    window.clearInterval(this.animationFrameId);
  };
  handleGraphChange = (event) => {
    this.setState({ graphType: event.target.value });
    localStorage.setItem("graph" + this.props.id, event.target.value);
    write(this.props.id, "graph", event.target.value);
  };

  handleQueryChange = (event) => {
    this.setState({ query: event.target.value });
    localStorage.setItem("query" + this.props.id, event.target.value);
    write(this.props.id, "query", event.target.value);
  };

  handleDeviceChange = (event) => {
    this.setState({ device: event.target.value });
    localStorage.setItem("device" + this.props.id, event.target.value);
    write(this.props.id, "device", event.target.value);
  };

  reset() {
    this.setState({
      graphType: "band",
      query: "nodered/client/memory",
      device: "device1",
    });
    localStorage.setItem("graph", defaultGraph);
    localStorage.setItem("query", defaultQuery);
    localStorage.setItem("device", defaultDevice);
  }

  renderPlot = () => {
    const fill = findStringColumns(this.state.table);
    const config = {
      table: this.state.table,
      layers: [new LayerConfig(this.state.graphType, fill).getConfig()],
      valueFormatters: new DataFormatter(this.state.query).getFormat(),
      xScale: "linear",
      yScale: "linear",
      legendFont: "12px sans-serif",
      legendHide: this.props.toggleLegend === 1 ? true : false,
      tickFont: "12px sans-serif",
      showAxes: true,
      staticLegend: { 
        heightRatio: 0.4,
        border: '2px solid black',
        fontBrightColor: 'black',
        backgroundColor:'white',
        colorizeRows: false,
        hide:  this.props.toggleLegend === 1 ? false : true
       },
    };
    return (

      <div className="graph-component" style={this.style}>
        <h2>
          <DeviceForm
            onChange={this.handleDeviceChange}
            device={this.state.device}
          />
          <GraphForm
            onChange={this.handleGraphChange}
            graphType={this.state.graphType}
          />
          <QueryForm
            onChange={this.handleQueryChange}
            query={this.state.query}
          />
        </h2>
        <h5>Last Updated: {this.state.lastUpdated}</h5>
        <Plot config={config} />
      </div>
    );
  };

  renderEmpty = () => {
    return (
      <div style={this.style}>
        <button onClick={() => this.reset()}>Reboot</button>
        <h3>Loading...</h3>
      </div>
    );
  };

  render = () => {
    return Object.keys(this.state.table).length > 0
      ? this.renderPlot()
      : this.renderEmpty();
  };
}
