import { DEFAULT_GAUGE_COLORS, GAUGE_THEME_LIGHT } from "@influxdata/giraffe";
import { GraphType } from "../../constants";

export default function gaugeConfig() {
  return {
    type: GraphType.GAUGE,
    gaugeColors: DEFAULT_GAUGE_COLORS,
    gaugeTheme: GAUGE_THEME_LIGHT,
  };
}
