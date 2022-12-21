# SIMonit

This is a project built using React and Giraffe Library integrated with InfluxDB and Express.

## Objective
Visualise real time data for Internet of Things devices. Allow user to select different kinds of graph types. Users will also be able to 
customise their dashboard to fit any number of different graphs on their customizable dashboard.

## What's inside:

**Client**

React app created with [create-react-app](https://github.com/facebook/create-react-app) that uses [Giraffe](https://github.com/influxdata/giraffe) and [RGL](https://github.com/react-grid-layout/react-grid-layout) to render plots and customize dashboard. See the `client` directory.

**Server**

ExpressJS server that uses both the [InfluxDB API](https://docs.influxdata.com/influxdb/v2.0/reference/api/) and the [influxdb-client-js](https://github.com/influxdata/influxdb-client-js) library to query data from an InfluxDB instance. See `server` directory. You will need to set up your own InfluxDB environment and add your credentials to dotenv file.

Uses [Nodemon](https://nodemon.io/) to allow automatic restart upon saving code in editor for continuous testing.

## Setup and Usage:
**Environment**
1. Fill in the .env file and place it in root of client folder

[DASH_INFLUX_URL_DEVELOPMENT=]
[DASH_INFLUX_BUCKET_DEVELOPMENT=]
[DASH_ORG_ID_DEVELOPMENT=]
[DASH_INFLUX_TOKEN_DEVELOPMENT=]

[STATIC_INFLUX_URL_DEVELOPMENT=]
[STATIC_INFLUX_BUCKET_DEVELOPMENT=]
[STATIC_ORG_ID_DEVELOPMENT=]
[STATIC_INFLUX_TOKEN_DEVELOPMENT=]

[MYSQL_USER_DEVELOPMENT=]
[MYSQL_PASS_DEVELOPMENT=]
[DB_URL_DEVELOPMENT=]
[DB_NAME_DEVELOPMENT=]

**Start server**
1. Navigate to `server` directory
2. `npm install`
3. `npm run server:dev` to start server with Nodemon on development environment `npm run server:prod` to start server with Nodemon on production environment
4. Server starts at `localhost:3001`

**Start UI**
**Environment**
1. Fill in the .env file and place it in root of server folder

[REACT_APP_BACKEND_URL=http://localhost:3001]
[REACT_APP_DEFAULT_DEVICE=EC2AMAZ-5FRJVA8]
[REACT_APP_DEFAULT_DRIVE=/]
[REACT_APP_AWS_GATEWAY=]
[REACT_APP_AUTH=]

1. Navigate to `client` directory in second terminal
2. `npm install`
3. `npm run start`
4. Navigate to `localhost:3000`
