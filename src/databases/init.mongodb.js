'use strict';

const mongoose = require('mongoose');
const {
  db: { username, password, name },
} = require('../configs/config.mongodb');

const connectionString = `mongodb+srv://${username}:${password}@shopdev.snlabi9.mongodb.net/${name}`;

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
      .then(() => console.log(`Connected Mongodb Success: env ${name}`))
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
