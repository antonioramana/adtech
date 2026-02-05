/**
 * Point d'entrée centralisé pour toutes les validations
 * Permet d'importer facilement toutes les validations depuis un seul endroit
 */

const { validateCampaign } = require('./campaignValidation');
const { validateStatus, VALID_STATUSES } = require('./statusValidation');
const { validateQueryParams } = require('./queryValidation');
const { createValidationError, formatJoiErrors } = require('./validationUtils');

module.exports = {
  // Validations
  validateCampaign,
  validateStatus,
  validateQueryParams,
  // Constantes
  VALID_STATUSES,
  // Utilitaires
  createValidationError,
  formatJoiErrors,
};

