'use strict';
// cách kết nối cũ, không sử dụng singleton pattern

const mongoose = require('mongoose');

const connectionString = `mongodb+srv://hna-db-cloud:hna1234z@shopdev.snlabi9.mongodb.net/`;
mongoose
  .connect(connectionString)
  .then(() => console.log(`Connected Mongodb Success`))
  .catch((err) => console.log(`Error Connect! ${err}`));

// dev
if (1 === 0) {
  mongoose.set('debug', true);
  mongoose.set('debug', { color: true });
}

module.exports = mongoose;
