const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Campaign:
 *       type: object
 *       required:
 *         - name
 *         - advertiser
 *         - budget
 *         - startDate
 *         - endDate
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         advertiser:
 *           type: string
 *         budget:
 *           type: number
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: [active, paused, finished]
 *         impressions:
 *           type: number
 *         clicks:
 *           type: number
 */

/**
 * @swagger
 * /campaigns:
 *   post:
 *     summary: Créer une campagne
 *     tags: [Campaigns]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campaign'
 *     responses:
 *       201:
 *         description: Campagne créée
 *       400:
 *         description: Erreur de validation
 */
router.post('/campaigns', campaignController.createCampaign);

/**
 * @swagger
 * /campaigns:
 *   get:
 *     summary: Lister les campagnes
 *     tags: [Campaigns]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, paused, finished]
 *         description: Filtrer par statut
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des campagnes
 */
router.get('/campaigns', campaignController.getAllCampaigns);

/**
 * @swagger
 * /campaigns/{id}:
 *   get:
 *     summary: Détail d'une campagne
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détail de la campagne
 *       404:
 *         description: Non trouvé
 */
router.get('/campaigns/:id', campaignController.getCampaignById);

/**
 * @swagger
 * /campaigns/{id}/status:
 *   patch:
 *     summary: Changer le statut d'une campagne
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, paused, finished]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *       400:
 *         description: Erreur de validation
 *       404:
 *         description: Non trouvé
 */
router.patch('/campaigns/:id/status', campaignController.updateStatus);

/**
 * @swagger
 * /campaigns/{id}/stats:
 *   get:
 *     summary: Statistiques d'une campagne
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statistiques calculées (CTR, CPC)
 *       404:
 *         description: Non trouvé
 */
router.get('/campaigns/:id/stats', campaignController.getStats);

module.exports = router;