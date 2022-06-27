import { QUERY_API } from '../config/configuration/InfluxDBConfig';



export default function read() {
  //TODO: Parameterise the query
  const testQ = `from(bucket: "javabucket")
|> range(start: -5m)
|> filter(fn: (r) => r["_measurement"] == "Save")
|> filter(fn: (r) => r["UID"] == "User2")
|> aggregateWindow(every: 15s, fn: last, createEmpty: false)
|> yield(name: "last")`;

    console.log('\n*** QUERY ***')
    QUERY_API.queryRows(testQ, {
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