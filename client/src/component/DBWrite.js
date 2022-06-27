import { INFLUXDB_CLIENT, INFLUX_ORGID } from "../config/configuration/InfluxDBConfig";
const { Point } = require("@influxdata/influxdb-client");
const tbucket = "javabucket"; // process.env.BUCKET_NAME //export the name of your bucket

export default function write(tag, field, value) {
  const writeApi = INFLUXDB_CLIENT.getWriteApi(INFLUX_ORGID, tbucket);
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
