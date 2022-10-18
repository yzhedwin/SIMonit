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

**Start server**
1. Navigate to `server` directory
2. `npm install`
3. `npm run server:dev` to start server with Nodemon on development environment `npm run server:prod` to start server with Nodemon on production environment
4. Server starts at `localhost:3001`

**Start UI**

1. Navigate to `client` directory in second terminal
2. `npm install`
3. `npm run start`
4. Navigate to `localhost:3000`
