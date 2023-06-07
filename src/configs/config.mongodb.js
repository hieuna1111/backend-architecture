'use strict';

const dev = {
  app: {
    port: process.env.PORT,
  },
  db: {
    name: process.env.DEV_DB_NAME,
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
  },
};

const prod = {
  app: {
    port: process.env.PORT,
  },
  db: {
    name: process.env.PROD_DB_NAME,
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
  },
};

const config = { dev, prod };
const env = process.env.NODE_ENV || 'dev';

module.exports = config[env];
