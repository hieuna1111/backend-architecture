require('dotenv').config();
const compression = require('compression');
const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const app = express();

// init middleware
// ghi log request: morgan('dev'), morgan('combined')
app.use(morgan('dev'));
// bao mat thong tin server: helmet
app.use(helmet());
// giam bang thong: compression
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// init db
require('./databases/init.mongodb');
const { checkOverLoad } = require('./helpers/check.connect');
// TODO: neu env === dev
// if (1 === 1) {
//   checkOverLoad();
// }

// init routes
app.use('/', require('./routes/index'));

// handling error

module.exports = app;
