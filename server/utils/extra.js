// Dependencies
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');

const app = express();

// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

app.use((req, res) => {
	res.send('Hello there !');
});

// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});

/// unused routes and controller  
// get available buckets
app.get("/buckets", (req, res) => {
  getBuckets().then((b) => res.end(JSON.stringify(b)));
});
app.get("/influx/:bucket/:tag", (req, res) => {
  const { tag, bucket } = req.params;
  let list = [];
  let fluxQuery = flux`` + GET_LIST(bucket, tag);
  staticQueryAPI.queryRows(fluxQuery, {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row);
      list.push(o._value);
    },
    error(error) {
      console.error(error);
      console.log("\nFinished ERROR");
    },
    complete() {
      console.log("\nFinished SUCCESS");
      res.end(JSON.stringify({ list }));
    },
  });
});

app.get("/influxsql/:bucket/:measurement", (req, res) => {
  const { bucket, measurement } = req.params;
  let csv = "";
  let fluxQuery = flux`` + INFLUX_MYSQL_QUERY(bucket, measurement);
  dashQueryAPI.queryLines(fluxQuery, {
    next(line) {
      csv = `${csv}${line}\n`;
    },
    error(error) {
      console.error(error);
      console.log("\nFinished influxsql query with error");
      res.end();
    },
    complete() {
      console.log("\nFinished influxsql query with SUCCESS");
      res.end(JSON.stringify({ csv }));
    },
  });
});

async function getBuckets() {
  return await staticBucketsAPI.getBuckets({ staticOrgID });
}