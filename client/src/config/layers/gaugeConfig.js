export default function gaugeConfig() {
  return {
    type: "gauge",
    gaugeColors: [
      {
        id: "red",
        type: "min",
        hex: "#FF0000",
        name: "Blue",
        value: 0,
      },
      {
        id: "green",
        type: "max",
        hex: "#00FF00",
        name: "Purple",
        value: 10000,
      },
    ],
  };
}
