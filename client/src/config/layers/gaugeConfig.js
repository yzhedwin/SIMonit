import { DEFAULT_GAUGE_COLORS, GAUGE_THEME_LIGHT } from "@influxdata/giraffe";

export default function gaugeConfig() {
  return {
    type: "gauge",
    gaugeColors: DEFAULT_GAUGE_COLORS,
    gaugeTheme: GAUGE_THEME_LIGHT,
  };
}
