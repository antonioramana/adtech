const Joi = require('joi');
const { createValidationError, formatJoiErrors } = require('./validationUtils');

/**
 * Schéma de validation Joi pour la création/mise à jour d'une campagne
 */
const campaignSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Le nom de la campagne est requis',
    'any.required': 'Le nom de la campagne est requis',
  }),
  advertiser: Joi.string().required().messages({
    'string.empty': 'L\'annonceur est requis',
    'any.required': 'L\'annonceur est requis',
  }),
  budget: Joi.number().min(0).required().messages({
    'number.base': 'Le budget doit être un nombre',
    'number.min': 'Le budget doit être supérieur ou égal à 0',
    'any.required': 'Le budget est requis',
  }),
  startDate: Joi.date().required().messages({
    'date.base': 'La date de début doit être une date valide',
    'any.required': 'La date de début est requise',
  }),
  endDate: Joi.date().min(Joi.ref('startDate')).required().messages({
    'date.base': 'La date de fin doit être une date valide',
    'date.min': 'La date de fin doit être postérieure ou égale à la date de début',
    'any.required': 'La date de fin est requise',
  }),
  status: Joi.string()
    .valid('active', 'paused', 'finished')
    .default('paused')
    .messages({
      'any.only': 'Le statut doit être "active", "paused" ou "finished"',
    }),
  impressions: Joi.number().min(0).default(0).messages({
    'number.base': 'Les impressions doivent être un nombre',
    'number.min': 'Les impressions doivent être supérieures ou égales à 0',
  }),
  clicks: Joi.number().min(0).default(0).messages({
    'number.base': 'Les clicks doivent être un nombre',
    'number.min': 'Les clicks doivent être supérieurs ou égaux à 0',
  }),
});

/**
 * Valide les données d'une campagne
 * @param {object} payload - Données à valider
 * @returns {object} Données validées et normalisées
 * @throws {Error} Erreur de validation avec statusCode 400
 */
function validateCampaign(payload) {
  const { error, value } = campaignSchema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    throw createValidationError(formatJoiErrors(error));
  }

  return value;
}

module.exports = {
  validateCampaign,
  campaignSchema,
};

