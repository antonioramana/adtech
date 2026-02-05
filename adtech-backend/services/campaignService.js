const Campaign = require('../models/Campaign');
const { validateCampaign, validateStatus, validateQueryParams } = require('../validations');

exports.createCampaign = async (payload) => {
  const validatedData = validateCampaign(payload);
  const campaign = new Campaign(validatedData);
  return campaign.save();
};

exports.getCampaigns = async (query) => {
  const { status, page, limit } = validateQueryParams(query);

  const filter = {};
  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const [campaigns, total] = await Promise.all([
    Campaign.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Campaign.countDocuments(filter),
  ]);

  return { campaigns, total };
};

exports.getCampaignById = (id) => Campaign.findById(id);

exports.updateStatus = async (id, status) => {
  const validatedStatus = validateStatus(status);
  return Campaign.findByIdAndUpdate(
    id,
    { status: validatedStatus },
    { new: true },
  );
};

exports.getStats = async (id) => {
  const campaign = await Campaign.findById(id);
  if (!campaign) return null;

  const ctr = campaign.impressions ? (campaign.clicks / campaign.impressions) * 100 : 0;
  const cpc = campaign.clicks ? campaign.budget / campaign.clicks : 0;

  return { ctr, cpc };
};


