//const BookInstance = require("../models/bookinstance");
//const Book = require("../models/book");
const queries = require("../config/constants");
const config = require("../config/index");
const { flux } = require("@influxdata/influxdb-client");

exports.index = (req, res) => {
  res.send("\nSIMonit API\n");
};

exports.gatewaylist = (req, res) => {
  let list = [];
  let fluxQuery = flux`` + queries.GET_GATEWAY_LIST();
  config.dashQueryAPI.queryRows(fluxQuery, {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row);
      list.push({
        id: o.gid,
        edge_id: o.eid,
        _measurement: o._measurement,
      });
    },
    error(error) {
      console.error(error);
      console.log("\nFinished fetching gatewaylist ERROR");
      res.send(`\n${error.message}\n`);
    },
    complete() {
      console.log("\nFinished fetching gatewaylist SUCCESS");
      res.send(JSON.stringify({ list }));
    },
  })
};

exports.devicelist = (req, res) => {
  const { gateway } = req.params;
    let list = [];
    let fluxQuery = flux`` + queries.GET_DEVICE_LIST(gateway);
    config.dashQueryAPI.queryRows(fluxQuery, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        list.push({ gateway_id: o.gid, id: o.did, name: o.name });
      },
      error(error) {
        console.error(error);
        console.log("\nFinished fetching devicelist ERROR");
        res.send(`\n${error.message}\n`);
      },
      complete() {
        console.log("\nFinished fetching devicelist  SUCCESS");
        res.send(JSON.stringify({ list }));
      },
    });
};

exports.metriclist = (req, res) => {
  const { device } = req.params;
  let list = [];
  let fluxQuery = flux`` +  queries.GET_METRIC_LIST(device);
  config.dashQueryAPI.queryRows(fluxQuery, {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row);
      list.push({ id: o.id, device_id: o.did, name: o.name });
    },
    error(error) {
      console.error(error);
      console.log("\nFinished fetching mettriclist ERROR");
      res.send(`\n${error.message}\n`);

    },
    complete() {
      console.log("\nFinished fetching mettriclist SUCCESS");
      res.send(JSON.stringify({ list }));
    },
  });
};

exports.trenddata = (req, res) => {
  const { gateway, metric } = req.params;
  let csv = "";
  let fluxQuery = flux`` +  queries.GET_TABLE(gateway, metric);
  config.dashQueryAPI.queryLines(fluxQuery, {
    next(line) {
      csv = `${csv}${line}\n`;
    },
    error(error) {
      console.error(error);
      console.log(`\nFinished fetching ${gateway} ERROR`);
      res.send(`\n${error.message}\n`);
    },
    complete() {
      console.log(`\nFinished fetching ${gateway} SUCCESS`);
      res.send(JSON.stringify({ csv }));
    },
  });
};
