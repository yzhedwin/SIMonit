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
export const DEFAULT_QUERY_1 = "memory";
export const DEFAULT_QUERY_2 = "cpu";
export const DEFAULT_QUERY_3 = "load";
export const DEFAULT_QUERY_4 = "drive";
export const DEFAULT_QUERY_5 = "uptime";
export const CONTEC_QUERY_DRIVE = "drive_contec";
export const DEFAULT_DEVICE = "d3f23b04aa74";
// export const DEFAULT_DEVICE = "EC2AMAZ-5FRJVA8";
export const DEFAULT_CPU = "0";
export const DEFAULT_DRIVE = "C:";
export const DEFAULT_DRIVE_ROOT = "/";
export const DEFAULT_DRIVE_MMC = "/mnt/ext_mmc";
/* STATIC PAGE */
export const DEFAULT_GRAPH_TYPE = "line";
export const STYLE = {
  height: "100%",
};
export const REST_URL = process.env.REACT_APP_BACKEND_URL;
