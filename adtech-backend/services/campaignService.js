const Joi = require('joi');
const Campaign = require('../models/Campaign');

const campaignSchema = Joi.object({
  name: Joi.string().required(),
  advertiser: Joi.string().required(),
  budget: Joi.number().min(0).required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref('startDate')).required(),
  status: Joi.string().valid('active', 'paused', 'finished').default('paused'),
  impressions: Joi.number().min(0).default(0),
  clicks: Joi.number().min(0).default(0),
});

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

exports.createCampaign = async (payload) => {
  const { error, value } = campaignSchema.validate(payload, { abortEarly: false });
  if (error) {
    throw validationError(error.details.map((d) => d.message).join(', '));
  }

  const campaign = new Campaign(value);
  return campaign.save();
};

exports.getCampaigns = async (query) => {
  const { status, page = 1, limit = 10 } = query;

  const filter = {};
  if (status) {
    filter.status = status;
  }

  const numericLimit = Math.min(Number(limit) || 10, 50);
  const numericPage = Number(page) || 1;
  const skip = (numericPage - 1) * numericLimit;

  const [campaigns, total] = await Promise.all([
    Campaign.find(filter).sort({ createdAt: -1 }).skip(skip).limit(numericLimit),
    Campaign.countDocuments(filter),
  ]);

  return { campaigns, total };
};

exports.getCampaignById = (id) => Campaign.findById(id);

exports.updateStatus = async (id, status) => {
  if (!['active', 'paused', 'finished'].includes(status)) {
    throw validationError('Invalid status value');
  }

  return Campaign.findByIdAndUpdate(
    id,
    { status },
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


