const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  totalSpend: Number,
  visits: Number,
  lastVisited: Date
});

module.exports = mongoose.model('Customer', customerSchema);
