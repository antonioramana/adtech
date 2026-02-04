require('dotenv').config();
const mongoose = require('mongoose');
const Campaign = require('../models/Campaign');

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const campaign = await Campaign.create({
      name: 'Campagne CTV Q2',
      advertiser: 'RetailSpot',
      budget: 15000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      impressions: 100000,
      clicks: 2500,
    });

    console.log('Campagne créée :', campaign._id);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();


