'use strict';

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 15000;

// count connection db
const countConnection = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of mongodb connections: ${numConnection}`);
};

let intervalId;
// check over load db
const checkOverLoad = () => {
  intervalId = setInterval(() => {
    const numConnection = mongoose.connections.length;
    console.log(`Active connections: ${numConnection}`);

    const memoryUsage = process.memoryUsage().rss;
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

    const numCores = os.cpus().length;
    // Example maximum number of connections base on number of cores
    const maxConnections = numCores * 5;
    if (numConnection > maxConnections) {
      console.log(`Connection overload detected`);
      // notify.send(...)
    }
  }, _SECONDS); // monitor every 5 seconds
};

// Call this function when you want to close the server/stop the monitoring
const stopMonitoring = () => {
  clearInterval(intervalId);
};

module.exports = { countConnection, checkOverLoad, stopMonitoring };
