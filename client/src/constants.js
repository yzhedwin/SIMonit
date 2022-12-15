// eslint-disable-next-line
import dotenv from "dotenv/config";
/* DASHBOARD */
export const API_REFRESH_RATE = 5000;
export const STATIC_API_REFRESH_RATE = 20000;
export const DEFAULT_GATEWAY = JSON.stringify({
  id: 1,
  edge_id: "CON000001",
  _measurement: "scm-002",
});
export const DEFAULT_METRIC_ID = "1";
export const DEFAULT_DEVICE_ID = "1";
/* DASHBOARD */
/* STATIC PAGE */
export const StaticMetric = {
  MEMORY: "memory",
  CPU: "cpu",
  LOAD: "load",
  DRIVE: "drive",
  UPTIME: "uptime",
};
export const GraphType = {
  BAND: "band",
  LINE: "line",
  "SINGLE STAT": "single stat",
  BAR: "bar",
  GAUGE: "gauge",
};
export const CONTEC_QUERY_DRIVE = "drive_contec";
export const DEFAULT_DEVICE = process.env.REACT_APP_DEFAULT_DEVICE;
export const DEFAULT_CPU = "0";
export const DEFAULT_DRIVE = process.env.REACT_APP_DEFAULT_DRIVE;
export const DEFAULT_DRIVE_MMC = "/mnt/ext_mmc";
/* STATIC PAGE */
export const DEFAULT_GRAPH_TYPE = GraphType.BAND;
export const STYLE = {
  height: "100%",
};
export const REST_URL = process.env.REACT_APP_BACKEND_URL;
export const AWS_API_URL = process.env.REACT_APP_AWS_GATEWAY;
export const AWS_AUTH = {
  headers: {
    "Content-Type": "application/json",
    "Authorization": process.env.REACT_APP_AUTH,
  },
};