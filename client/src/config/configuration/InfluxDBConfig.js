import 'dotenv/config';
const { InfluxDB } = require("@influxdata/influxdb-client");


export const INFLUX_URL = process.env.REACT_APP_INFLUX_URL; // url of your cloud instance
export const INFLUX_TOKEN = process.env.REACT_APP_INFLUX_TOKEN; // create an all access token in the UI, export it as INFLUX_TOKEN
export const INFLUX_ORGID = process.env.REACT_APP_ORG_ID;  // export your org id
export const INFLUXDB_BUCKET = process.env.REACT_APP_BUCKET_NAME; //export the name of your bucket
export const INFLUXDB_CLIENT = new InfluxDB({ url: INFLUX_URL, token: INFLUX_TOKEN });
export const QUERY_API = INFLUXDB_CLIENT.getQueryApi(INFLUX_ORGID);