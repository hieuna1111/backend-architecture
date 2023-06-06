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

// init db
require('./databases/init.mongodb');
const { checkOverLoad } = require('./helpers/check.connect');
checkOverLoad();

// init routes
app.get('/', (req, res, next) => {
  const str = 'Hello toi la the nay the kia the no';
  return res.status(200).json({
    message: 'Welcome to backend architecture',
    metadata: str.repeat(10000),
  });
});

// handling error

module.exports = app;
