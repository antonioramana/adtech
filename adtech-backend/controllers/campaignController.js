const campaignService = require('../services/campaignService');

// Créer une campagne
exports.createCampaign = async (req, res) => {
  try {
    const campaign = await campaignService.createCampaign(req.body);
    res.status(201).json(campaign);
  } catch (err) {
    res.status(err.statusCode || 400).json({ error: err.message });
  }
};

// Lister toutes les campagnes (avec filtres simples + pagination)
exports.getAllCampaigns = async (req, res) => {
  try {
    const { campaigns, total } = await campaignService.getCampaigns(req.query);
    res.json({ data: campaigns, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Détail d’une campagne
exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await campaignService.getCampaignById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Not found' });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Changer le statut
exports.updateStatus = async (req, res) => {
  try {
    const campaign = await campaignService.updateStatus(req.params.id, req.body.status);
    if (!campaign) return res.status(404).json({ error: 'Not found' });
    res.json(campaign);
  } catch (err) {
    res.status(err.statusCode || 400).json({ error: err.message });
  }
};

// Stats : CTR et CPC
exports.getStats = async (req, res) => {
  try {
    const stats = await campaignService.getStats(req.params.id);
    if (!stats) return res.status(404).json({ error: 'Not found' });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
