const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  rules: [
    {
      field: String,
      operator: String,
      value: mongoose.Schema.Types.Mixed
    }
  ],
  audienceSize: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Campaign', campaignSchema);
