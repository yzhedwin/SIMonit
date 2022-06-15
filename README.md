# App-Girrafe

This is a project built using ReactJS and Giraffe Library integrated with InfluxDB.

## What's inside:

**Client:**

React app created with [create-react-app](https://github.com/facebook/create-react-app) that uses Giraffe to render plots. See the `client` directory.

**Server**

ExpressJS server that uses both the [InfluxDB API](https://docs.influxdata.com/influxdb/v2.0/reference/api/) and the [influxdb-client-js](https://github.com/influxdata/influxdb-client-js) library to query data from an InfluxDB instance. See `server` directory.

## How to:

**Start server**
1. `npm install`
1. `npm run server`
1. Server starts at `localhost:3001`

**Start UI**

1. Navigate to `client` directory in second terminal
1. `npm install`
1. `npm start`
1. Navigate to `localhost:3000`
