const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const baseURL = "http://localhost:8086"; //process.env.INFLUX_URL // url of your cloud instance
const influxToken =
  "q2H3H17WktGDhPOfZey38XRHW6RiTagbEDyJGuttmimwXsUvIgK2nPYyb0tccej9ZrTD5Tv9_FXdr84ZF7LfFw=="; //' //process.env.INFLUX_TOKEN; // create an all access token in the UI, export it as INFLUX_TOKEN
const orgID = "7b2a33953b31c6c9"; //process.env.ORG_ID // export your org id
const tbucket = "javabucket"; // process.env.BUCKET_NAME //export the name of your bucket

// connect to influxdb
const influxDB = new InfluxDB({ url: baseURL, token: influxToken });

export default function write(tag, field, value) {
  const writeApi = influxDB.getWriteApi(orgID, tbucket);
  // setup default tags for all writes through this API
  writeApi.useDefaultTags({ location: "browser" });

  const point1 = new Point("Save")
    .tag("UID", "User1")
    .tag("Graph", tag)
    .stringField(field, value);
  writeApi.writePoint(point1);
  // flush pending writes and close writeApi
  writeApi
    .close()
    .then(() => {
      console.log("WRITE FINISHED");
    })
    .catch((e) => {
      console.log("WRITE FAILED", e);
    });
}
