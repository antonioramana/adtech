const Joi = require('joi');
const { createValidationError, formatJoiErrors } = require('./validationUtils');
const { VALID_STATUSES } = require('./statusValidation');

/**
 * Schéma de validation pour les paramètres de requête (pagination, filtres)
 */
const queryParamsSchema = Joi.object({
  status: Joi.string()
    .valid(...VALID_STATUSES)
    .optional()
    .messages({
      'any.only': `Le statut doit être l'un des suivants: ${VALID_STATUSES.join(', ')}`,
    }),
  page: Joi.number().integer().min(1).optional().default(1).messages({
    'number.base': 'La page doit être un nombre',
    'number.integer': 'La page doit être un entier',
    'number.min': 'La page doit être supérieure ou égale à 1',
  }),
  limit: Joi.number().integer().min(1).max(100).optional().default(10).messages({
    'number.base': 'La limite doit être un nombre',
    'number.integer': 'La limite doit être un entier',
    'number.min': 'La limite doit être supérieure ou égale à 1',
    'number.max': 'La limite ne peut pas dépasser 100',
  }),
});

/**
 * Valide et normalise les paramètres de requête
 * @param {object} query - Paramètres de requête à valider
 * @returns {object} Paramètres validés et normalisés
 * @throws {Error} Erreur de validation avec statusCode 400
 */
function validateQueryParams(query) {
  const { error, value } = queryParamsSchema.validate(query, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    throw createValidationError(formatJoiErrors(error));
  }

  return value;
}

module.exports = {
  validateQueryParams,
};

