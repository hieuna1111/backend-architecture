'use strict';

const mongoose = require('mongoose');

const connectionString = `mongodb+srv://hna-db-cloud:hna1234z@shopdev.snlabi9.mongodb.net/`;

// building: singleton pattern class to connect database
class Database {
  // step 3
  constructor() {
    this.connect();
  }

  // step 4
  connect(type = 'mongodb') {
    if (1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }
    mongoose
      .connect(connectionString, {
        maxPoolSize: 50,
      })
      .then(() => console.log(`Connected Mongodb Success PRO`))
      .catch((err) => console.log(`Error Connect! ${err}`));
  }

  // step 1
  static getInstance() {
    if (!Database.instance) {
      // step 2
      Database.instance = new Database();
    }
    // step 5
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
