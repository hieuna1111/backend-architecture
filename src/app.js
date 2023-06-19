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
const { checkOverLoad } = require('./common/helpers/checkConnectionDb.helper');
// TODO: neu env === dev
// if (1 === 1) {
//   checkOverLoad();
// }

// init routes
app.use('/', require('./routes/index'));

// handling error
app.use((req, res, next) => {
  const error = new Error('Not Found!');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    code: statusCode,
    stack: error.stack,
    message: error.message || 'Internal Server Error',
  });
});

module.exports = app;
