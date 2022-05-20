#!/usr/bin/env node
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const { InfluxDB, flux } = require('@influxdata/influxdb-client')
const { BucketsAPI } = require('@influxdata/influxdb-client-apis')
const { query } = require('express')

// vars to connect to bucket in influxdb
const baseURL = 'http://localhost:8086' //process.env.INFLUX_URL // url of your cloud instance
const influxToken = '-ldkgALDsiPln-cyb3pxrtUENgIizoJz2X1vQp8CqDXrupLo0V988f7DFkxHww_teFGxJnCRlpHJ_vtih0-fLQ=='  //To2yNAUkVv8mRImgCNy9sj5UmhX2VIiy0J8GEAJAOoeBia5k_bw7bJ40eZwQd6q8vBgAugsjvfY3qguTvUx3iw==' //process.env.INFLUX_TOKEN; // create an all access token in the UI, export it as INFLUX_TOKEN
const orgID = '50cede9cae68c71e' //process.env.ORG_ID // export your org id
const bucket = 'testbucket' // process.env.BUCKET_NAME //export the name of your bucket

// connect to influxdb
const influxDB = new InfluxDB({ url: baseURL, token: influxToken })
const queryApi = influxDB.getQueryApi(orgID)
const bucketsAPI = new BucketsAPI(influxDB)

const influxProxy = axios.create({
  baseURL,
  headers: {
    'Authorization': `Token ${influxToken}`,
    'Content-Type': 'application/json'
  }
});
//TODO vary query,buckets
const diskQuery = `from(bucket: "${bucket}")
|> range(start: -5m)
|> filter(fn: (r) => r["_measurement"] == "disk")
|> filter(fn: (r) => r["_field"] == "free")
|> filter(fn: (r) => r["device"] == "sdc")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "last")`;


const cpuQuery = `from(bucket: "${bucket}")
|> range(start: -5m)
|> filter(fn: (r) => r["_measurement"] == "cpu")
|> filter(fn: (r) => r["_field"] == "usage_user" or r["_field"] == "usage_system")
|> filter(fn: (r) => r["cpu"] == "cpu-total")
|> aggregateWindow(every: 15s, fn: mean, createEmpty: false)
|> yield(name: "mean")

from(bucket: "${bucket}")
|> range(start: -5m)
|> filter(fn: (r) => r["_measurement"] == "cpu")
|> filter(fn: (r) => r["_field"] == "usage_user" or r["_field"] == "usage_system")
|> filter(fn: (r) => r["cpu"] == "cpu-total")
|> aggregateWindow(every: 15s, fn: min, createEmpty: false)
|> yield(name: "min")

from(bucket: "${bucket}")
|> range(start: -5m)
|> filter(fn: (r) => r["_measurement"] == "cpu")
|> filter(fn: (r) => r["_field"] == "usage_user" or r["_field"] == "usage_system")
|> filter(fn: (r) => r["cpu"] == "cpu-total")
|> aggregateWindow(every: 15s, fn: max, createEmpty: false)
|> yield(name: "max")`;

const memQuery = `from(bucket: "${bucket}")
    |> range(start: -5m)
    |> filter(fn: (r) => r["_measurement"] == "mem")
    |> filter(fn: (r) => r["_field"] == "used")
    |> aggregateWindow(every: 15s, fn: last, createEmpty: false)
    |> yield(name: "last")`;

// start the server
const app = express();
app.use(cors())
const port = 3001;

// get available buckets
app.get('/buckets', (req, res) => {
  getBuckets().then((b) => res.end(JSON.stringify(b)))
})

// get cpu usage data via influxdb-client-js library and push to :3001/cpu/client
app.get('/cpu/client', (req, res) => {
  let csv = ''
  let clientQuery = flux``+ cpuQuery
  queryApi.queryLines(clientQuery, {
    next(line) {
      csv = `${csv}${line}\n`;
    },
    error(error) {
      console.error(error)
      console.log('\nFinished /cpu/client ERROR')
      res.end()
    },
    complete() {
      console.log('\nFinished /cpu/client SUCCESS')
      res.end(JSON.stringify({ csv }))
    },
  })
})

app.get('/disk/client', (req, res) => {
    let csv = ''
    let clientQueryDisk = flux`` + diskQuery
    queryApi.queryLines(clientQueryDisk, {
        next(line) {
            csv = `${csv}${line}\n`;
        },
        error(error) {
            console.error(error)
            console.log('\nFinished /disk/client ERROR')
            res.end()
        },
        complete() {
            console.log('\nFinished /disk/client SUCCESS')
            res.end(JSON.stringify({ csv }))
        },
    })
})
app.get('/mem/client', (req, res) => {
    let csv = ''
    let clientQueryMem = flux`` + memQuery
    queryApi.queryLines(clientQueryMem, {
        next(line) {
            csv = `${csv}${line}\n`;
        },
        error(error) {
            console.error(error)
            console.log('\nFinished /mem/client ERROR')
            res.end()
        },
        complete() {
            console.log('\nFinished /mem/client SUCCESS')
            res.end(JSON.stringify({ csv }))
        },
    })
})

//// get cpu usage data via influxdb api
//app.get('/cpu/api', (req, res) => {
//  let apiQuery = cpuQuery.trim();
//  console.log(apiQuery)
//  influxProxy.request({
//    method: 'post',
//    url: 'api/v2/query',
//    params: {
//      orgID
//    },
//    data: {
//      query: apiQuery,
//      extern: {"type":"File","package":null,"imports":null,"body":[{"type":"OptionStatement","assignment":{"type":"VariableAssignment","id":{"type":"Identifier","name":"v"},"init":{"type":"ObjectExpression","properties":[{"type":"Property","key":{"type":"Identifier","name":"bucket"},"value":{"type":"StringLiteral","value":"telegraf"}},{"type":"Property","key":{"type":"Identifier","name":"timeRangeStart"},"value":{"type":"UnaryExpression","operator":"-","argument":{"type":"DurationLiteral","values":[{"magnitude":1,"unit":"h"}]}}},{"type":"Property","key":{"type":"Identifier","name":"timeRangeStop"},"value":{"type":"CallExpression","callee":{"type":"Identifier","name":"now"}}},{"type":"Property","key":{"type":"Identifier","name":"windowPeriod"},"value":{"type":"DurationLiteral","values":[{"magnitude":10000,"unit":"ms"}]}}]}}}]},
//      dialect :{"annotations":["group","datatype","default"]}
//    }
//  }).then((response) => {
//    console.log('\nFinished /cpu/api SUCCESS')
//    res.send(JSON.stringify({csv: response.data}))
//  }).catch(error => {
//    console.log(error)
//    console.log('\nFinished /cpu/api ERROR')
//    res.send(error.message)
//  });
//})

app.listen(port, () => {
  console.log(`listening on port :${port}`);
});

async function getBuckets() {
  return await bucketsAPI.getBuckets({ orgID })
}
