import { NINETEEN_EIGHTY_FOUR, timeFormatter } from '@influxdata/giraffe'

export default function lineConfig(table, fill) {
    return {
        table: table,
        layers: [
            {
                type: 'line',
                x: '_time',
                y: '_value',
                fill,
                colors: NINETEEN_EIGHTY_FOUR,
                interpolation: "monotoneX",
                lineWidth: 3,
                lineOpacity: 0.7,
                shadeOpacity: 0.3,
                hoverDimension: "auto",
            }
        ],
        valueFormatters: {
            _time: timeFormatter({
                timeFormat: "UTC",
                format: "HH:mm",
            }),
            _value: val =>
                typeof val === 'number'
                    ? `${(val / 1000000).toFixed(2)}M`
                    : val
        },
        xScale: "linear",
        yScale: "linear",
        legendFont: "12px sans-serif",
        tickFont: "12px sans-serif",
        showAxes: true,
    };
}