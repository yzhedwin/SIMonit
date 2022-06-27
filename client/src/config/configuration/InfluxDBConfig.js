const { InfluxDB } = require("@influxdata/influxdb-client");

export const INFLUX_URL = "http://localhost:8086"; //process.env.INFLUX_URL // url of your cloud instance
export const INFLUX_TOKEN =
  "q2H3H17WktGDhPOfZey38XRHW6RiTagbEDyJGuttmimwXsUvIgK2nPYyb0tccej9ZrTD5Tv9_FXdr84ZF7LfFw=="; //' //process.env.INFLUX_TOKEN; // create an all access token in the UI, export it as INFLUX_TOKEN
export const INFLUX_ORGID = "7b2a33953b31c6c9"; //process.env.ORG_ID // export your org id
export const INFLUXDB_BUCKET = "testbucket2"; // process.env.BUCKET_NAME //export the name of your bucket
export const INFLUXDB_CLIENT = new InfluxDB({ url: INFLUX_URL, token: INFLUX_TOKEN });
export const QUERY_API = INFLUXDB_CLIENT.getQueryApi(INFLUX_ORGID);