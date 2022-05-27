import React from 'react'
import { fromFlux, Plot } from '@influxdata/giraffe'
import axios from 'axios'
import { findStringColumns } from '../helpers'
import Configuration from '../config/Configuration/Configuration';
import DeviceForm from '../forms/DeviceForm';
import GraphForm from '../forms/GraphForm';
import QueryForm from '../forms/QueryForm';

const REASONABLE_API_REFRESH_RATE = 5000;

export class Graph extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            table: {},
            lastUpdated: '',
            graphType: 'band',
            query: 'nodered/client/memory',
            device: 'device1'
        };
        this.handleGraphChange = this.handleGraphChange.bind(this);
        this.handleDeviceChange = this.handleDeviceChange.bind(this);
        this.handleQueryChange = this.handleQueryChange.bind(this);
    }

    animationFrameId = 0;
    style = {
        width: '500px',
        height: '200px',
        margin: "50px",
    };

    getDataAndUpdateTable = async () => {
        const resp = await axios.get('http://localhost:3001/' + this.state.query);

        try {
            let results = fromFlux(resp.data.csv);
            let currentDate = new Date();
            this.setState({ table: results.table, lastUpdated: currentDate.toLocaleTimeString() });
        } catch (error) {
            console.error('error', error.message);
        }
    }

    async componentDidMount() {
        try {
            this.getDataAndUpdateTable();
            this.animationFrameId = window.setInterval(this.getDataAndUpdateTable, REASONABLE_API_REFRESH_RATE);
        } catch (error) {
            console.error(error);
        }
    }

    componentWillUnmount = () => {
        window.clearInterval(this.animationFrameId);
    }
    handleGraphChange = (event) => {
         this.setState({ graphType: event.target.value });      
     };

     handleQueryChange = (event) => {
         this.setState({ query: event.target.value });
         
     };

     handleDeviceChange = (event) => {
        this.setState({ device: event.target.value });
     };


    renderPlot = () => {
        const fill = findStringColumns(this.state.table);
        const config = new Configuration(this.state.graphType, this.state.table, fill).getConfig();

        return (

            <div style={this.style}>
                <h2>
                 <DeviceForm onChange={this.handleDeviceChange} device={this.state.device}/> 
                 <GraphForm onChange={this.handleGraphChange} graphType={this.state.graphType}/> 
                 <QueryForm onChange={this.handleQueryChange} query={this.state.query}/> 
                 </h2>
                 <h2>{this.state.device}</h2>
                <h3>{this.state.query}</h3>
                <h5>Last Updated: {this.state.lastUpdated}</h5>
                <Plot config={config} />
            </div>
        )
    }

    renderEmpty = () => {
        return (
            <div style={this.style}>
                <h3>Loading...</h3>
            </div>
        )
    }

    render = () => {
        return Object.keys(this.state.table).length > 0 ? this.renderPlot() : this.renderEmpty();
    }
}