import React from 'react'
import GridLayout from "react-grid-layout";
import { PlotSelector } from './PlotSelector';

class TestGrid extends React.Component {
    render() {
        // layout is an array of objects, see the demo for more complete usage
        const layout = [
            { i: "a", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
            { i: "b", x: 4, y: 0, w: 3, h: 2 }
        ];
        return (
            <GridLayout
                className="layout"
                layout={layout}
                cols={12}
                rowHeight={200}
                width={2000}
            >
                <div key="a"><PlotSelector/></div>
                <div key="b"><PlotSelector /></div>
            </GridLayout>
        );
    }
}
export default TestGrid