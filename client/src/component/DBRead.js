const { InfluxDB } = require('@influxdata/influxdb-client')
const baseURL = 'http://localhost:8086' //process.env.INFLUX_URL // url of your cloud instance
const influxToken = 'q2H3H17WktGDhPOfZey38XRHW6RiTagbEDyJGuttmimwXsUvIgK2nPYyb0tccej9ZrTD5Tv9_FXdr84ZF7LfFw==' //' //process.env.INFLUX_TOKEN; // create an all access token in the UI, export it as INFLUX_TOKEN
const orgID = '7b2a33953b31c6c9' //process.env.ORG_ID // export your org id
// connect to influxdb
const influxDB = new InfluxDB({ url: baseURL, token: influxToken })

const testQ = `from(bucket: "javabucket")
|> range(start: -5m)
|> filter(fn: (r) => r["_measurement"] == "Save")
|> filter(fn: (r) => r["UID"] == "User2")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "last")`;

export default function read() {
    console.log('\n*** QUERY ***')
    const queryApi = influxDB.getQueryApi(orgID)
    queryApi.queryRows(testQ, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row)
        if (o.example){
          // custom output for example query
          console.log(
            `${o._time} ${o._measurement} in '${o.location}' (${o.example}): ${o._field}=${o._value}`
          )
        } else {
          // default output
          console.log(JSON.stringify(o, null, 2))
        }
      },
      error(error) {
        console.log('QUERY FAILED', error)
      },
      complete() {
        console.log('QUERY FINISHED')
      },
    })
  }