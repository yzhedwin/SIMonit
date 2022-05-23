import React from 'react'
import { fromFlux, Plot } from '@influxdata/giraffe'
import axios from 'axios'
import { findStringColumns } from '../helpers'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Configuration from '../config/Configuration/Configuration';

const REASONABLE_API_REFRESH_RATE = 5000;
const types = ['band', 'line', 'single stat'];

export class PlotSelector extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            table: {},
            lastUpdated: '',
            graphType: types[0]
        };
    }
    animationFrameId = 0;
    style = {
        width: "500px",
        height: "200px",
        margin: "50px",
    };

    getDataAndUpdateTable = async () => {
        const resp = await axios.get('http://localhost:3001/cpu/client');

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

    renderPlot = () => {
        const fill = findStringColumns(this.state.table)
        const config = new Configuration(this.state.graphType, this.state.table, fill).getConfig()


        const handleChange = (event) => {
            this.setState({ graphType: event.target.value });
        };
        return (
            <div style={this.style}>
                <h2>
                    <FormControl sx={{ m: 1, minWidth: 80 }}>
                        <InputLabel id="select">Graph Type</InputLabel>
                        <Select
                            labelId="select"
                            id="select"
                            value={this.state.graphType}
                            onChange={handleChange}
                            autoWidth
                            label="Graph Type"
                        >
                            <MenuItem value={"band"}>Band</MenuItem>
                            <MenuItem value={"line"}>Line</MenuItem>
                            <MenuItem value={"single stat"}>Single Stat</MenuItem>
                        </Select>
                    </FormControl>
                </h2>
                <h3>CPU Usage</h3>
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