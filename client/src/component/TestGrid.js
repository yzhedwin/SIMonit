import React from 'react'
import GridLayout from "react-grid-layout";
import { Graph } from './Graph';
import '../Grid.css'

class TestGrid extends React.Component {

    render() {
        // layout is an array of objects, see the demo for more complete usage
        const layout = [
            { i: "a", x: 0, y: 0, w: 10, h: 10, autoSize: true},
            { i: "b", x: 10, y: 15, w: 10, h: 10 }
        ];

        return (
            <GridLayout
                className="layout"
                layout={layout}
                cols={4}
                items={4}
                rowHeight={60}
                isBounded={false}
            >
                <div key="a"><Graph/></div>
                <div key="b"><Graph/></div>
            </GridLayout>
        );
    }
}
export default TestGrid