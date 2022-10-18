const queries = require("../config/constants");
const config = require("../config/index");
const { flux } = require("@influxdata/influxdb-client");

exports.drive = (req, res) => {
  const { did } = req.params;
  const mount = req.query.mount;
  let csv = "";
  let fluxQuery = flux`` + queries.FLUX_QUERY_DRIVE(did, mount);
  config.staticQueryAPI.queryLines(fluxQuery, {
    next(line) {
      csv = `${csv}${line}\n`;
    },
    error(error) {
      console.error(error);
      console.log("\nFinished " + did + " drive ERROR");
      res.send(`\n${error}\n`);
    },
    complete() {
      console.log("\nFinished " + did + " drive SUCCESS");
      res.send(JSON.stringify({ csv }));
    },
  });
};

exports.drive_band = (req, res) => {
  const { did } = req.params;
  const mount = req.query.mount;
  let csv = "";
  let fluxQuery = flux`` + queries.FLUX_QUERY_DRIVE_BAND(did, mount);
  config.staticQueryAPI.queryLines(fluxQuery, {
    next(line) {
      csv = `${csv}${line}\n`;
    },
    error(error) {
      console.error(error);
      console.log("\nFinished " + did + mount + " drive band Error");
      res.send(`\n${error}\n`);
    },
    complete() {
      console.log("\nFinished " + did + mount + " drive band SUCCESS");
      res.send(JSON.stringify({ csv }));
    },
  });
};

exports.memory = (req, res) => {
  const { did } = req.params;
  let csv = "";
  let fluxQuery = flux`` + queries.FLUX_QUERY_MEMORY(did);
  config.staticQueryAPI.queryLines(fluxQuery, {
    next(line) {
      csv = `${csv}${line}\n`;
    },
    error(error) {
      console.error(error);
      console.log("\nFinished " + did + " memory ERROR");
      res.send(`\n${error}\n`);
    },
    complete() {
      console.log("\nFinished " + did + " memory SUCCESS");
      res.send(JSON.stringify({ csv }));
    },
  });
};
exports.memory_band = (req, res) => {
  const { did } = req.params;
  let csv = "";
  let fluxQuery = flux`` + queries.FLUX_QUERY_MEMORY_BAND(did);
  config.staticQueryAPI.queryLines(fluxQuery, {
    next(line) {
      csv = `${csv}${line}\n`;
    },
    error(error) {
      console.error(error);
      console.log("\nFinished " + did + " memory band ERROR");
      res.send(`\n${error}\n`);
    },
    complete() {
      console.log("\nFinished " + did + " memory band SUCCESS");
      res.send(JSON.stringify({ csv }));
    },
  });
};
exports.load = (req, res) => {
  const { did } = req.params;
  let csv = "";
  let fluxQuery = flux`` + queries.FLUX_QUERY_LOAD(did);
  config.staticQueryAPI.queryLines(fluxQuery, {
    next(line) {
      csv = `${csv}${line}\n`;
    },
    error(error) {
      console.error(error);
      console.log("\nFinished " + did + " load ERROR");
      res.send(`\n${error}\n`);
    },
    complete() {
      console.log("\nFinished " + did + " load SUCCESS");
      res.send(JSON.stringify({ csv }));
    },
  });
};
exports.load_band = (req, res) => {
  const { did } = req.params;
  let csv = "";
  let fluxQuery = flux`` + queries.FLUX_QUERY_LOAD_BAND(did);
  config.staticQueryAPI.queryLines(fluxQuery, {
    next(line) {
      csv = `${csv}${line}\n`;
    },
    error(error) {
      console.error(error);
      console.log("\nFinished " + did + " load band ERROR");
      res.send(`\n${error}\n`);
    },
    complete() {
      console.log("\nFinished " + did + " load band SUCCESS");
      res.send(JSON.stringify({ csv }));
    },
  });
};
exports.uptime = (req, res) => {
  const { did } = req.params;
  let csv = "";
  let fluxQuery = flux`` + queries.FLUX_QUERY_UPTIME(did);
  config.staticQueryAPI.queryLines(fluxQuery, {
    next(line) {
      csv = `${csv}${line}\n`;
    },
    error(error) {
      console.error(error);
      console.log("\nFinished " + did + " uptime ERROR");
      res.send(`\n${error}\n`);
    },
    complete() {
      console.log("\nFinished " + did + " uptime band SUCCESS");
      res.send(JSON.stringify({ csv }));
    },
  });
};
exports.uptime_band = (req, res) => {
  const { did } = req.params;
  let csv = "";
  let fluxQuery = flux`` + queries.FLUX_QUERY_UPTIME_BAND(did);
  config.staticQueryAPI.queryLines(fluxQuery, {
    next(line) {
      csv = `${csv}${line}\n`;
    },
    error(error) {
      console.error(error);
      console.log("\nFinished " + did + " uptime band ERROR");
      res.send(`\n${error}\n`);
    },
    complete() {
      console.log("\nFinished " + did + " uptime band SUCCESS");
      res.send(JSON.stringify({ csv }));
    },
  });
};
exports.cpu = (req, res) => {
  const { did, cpuID } = req.params;
  let csv = "";
  let fluxQuery = flux`` + queries.FLUX_QUERY_CPU(did, cpuID);
  config.staticQueryAPI.queryLines(fluxQuery, {
    next(line) {
      csv = `${csv}${line}\n`;
    },
    error(error) {
      console.error(error);
      console.log("\nFinished " + did + " " + cpuID + " CPU ERROR");
      res.send(`\n${error}\n`);
    },
    complete() {
      console.log("\nFinished " + did + " " + cpuID + " CPU SUCCESS");
      res.send(JSON.stringify({ csv }));
    },
  });
};
exports.cpu_band = (req, res) => {
  const { did, cpuID } = req.params;
  let csv = "";
  let fluxQuery = flux`` + queries.FLUX_QUERY_CPU_BAND(did, cpuID);
  config.staticQueryAPI.queryLines(fluxQuery, {
    next(line) {
      csv = `${csv}${line}\n`;
    },
    error(error) {
      console.error(error);
      console.log("\nFinished " + did + " " + cpuID + " CPU ERROR");
      res.send(`\n${error}\n`);
    },
    complete() {
      console.log("\nFinished " + did + " " + cpuID + " CPU SUCCESS");
      res.send(JSON.stringify({ csv }));
    },
  });
};
