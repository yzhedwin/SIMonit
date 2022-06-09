import React, { Component } from 'react'
import { Graph } from '../component/Graph'

const defaultGraph = "band";
const defaultQuery = "nodered/client/memory";
const defaultDevice = "device1";

export default class StaticLegend extends Component {
    
  render() {
    return (
        <div >
          {<Graph graphType={defaultGraph}
              query={defaultQuery}
              device={defaultDevice}/>}
        </div>
    )
  }
}
