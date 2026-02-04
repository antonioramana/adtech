const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  advertiser: { type: String, required: true },
  budget: { type: Number, required: true, min: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'paused', 'finished'], default: 'paused' },
  impressions: { type: Number, default: 0, min: 0 },
  clicks: { type: Number, default: 0, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);