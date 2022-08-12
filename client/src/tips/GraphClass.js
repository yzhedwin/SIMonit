import React from "react";
import { fromFlux, Plot } from "@influxdata/giraffe";
import axios from "axios";
import { findStringColumns } from "../helpers";
import DeviceForm from "../forms/DeviceForm";
import GraphForm from "../forms/GraphForm";
import QueryForm from "../forms/QueryForm";
import write from "../component/DBWrite";
import LayerConfig from "../config/configuration/LayerConfig";
import DataFormatter from "../config/configuration/DataFormatter";
import {API_REFRESH_RATE, DEFAULT_DEVICE, DEFAULT_GRAPH_TYPE, DEFAULT_QUERY_1} from "../constants";

export default class Graph extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      table: {},
      lastUpdated: "",
      graphType: props.graphType,
      query: props.query,
      device: props.device,
    };
    console.log(this.state.query)
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
    const resp = await axios.get("http://localhost:3001/" + this.state.query + "/" + this.state.device);
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
        API_REFRESH_RATE
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
    localStorage.setItem("graph", DEFAULT_GRAPH_TYPE);
    localStorage.setItem("query", DEFAULT_QUERY_1);
    localStorage.setItem("device", DEFAULT_DEVICE);
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
    console.log("Graph is rendered")
    return Object.keys(this.state.table).length > 0
      ? this.renderPlot()
      : this.renderEmpty();
  };
}
