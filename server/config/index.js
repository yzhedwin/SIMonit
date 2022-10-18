const { InfluxDB, flux } = require("@influxdata/influxdb-client");
const { BucketsAPI } = require("@influxdata/influxdb-client-apis");
const {
  dashURL,
  dashInfluxToken,
  timeout,
  dashOrgID,
  staticURL,
  staticInfluxToken,
  staticOrgID,
} = require("./constants");

//connections to influxdb
const dashInfluxDB = new InfluxDB({
  url: dashURL,
  token: dashInfluxToken,
  timeout: timeout,
});
exports.dashQueryAPI = dashInfluxDB.getQueryApi(dashOrgID);
exports.dashBucketsAPI = new BucketsAPI(dashInfluxDB);

const staticInfluxDB = new InfluxDB({
  url: staticURL,
  token: staticInfluxToken,
});

exports.staticQueryAPI = staticInfluxDB.getQueryApi(staticOrgID);
exports.staticBucketsAPI = new BucketsAPI(staticInfluxDB);
