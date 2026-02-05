const { createValidationError } = require('./validationUtils');

/**
 * Statuts valides pour une campagne
 */
const VALID_STATUSES = ['active', 'paused', 'finished'];

/**
 * Valide un statut de campagne
 * @param {string} status - Statut à valider
 * @returns {string} Statut validé
 * @throws {Error} Erreur de validation si le statut est invalide
 */
function validateStatus(status) {
  if (!status) {
    throw createValidationError('Le statut est requis');
  }

  if (!VALID_STATUSES.includes(status)) {
    throw createValidationError(
      `Statut invalide. Les valeurs autorisées sont: ${VALID_STATUSES.join(', ')}`
    );
  }

  return status;
}

module.exports = {
  validateStatus,
  VALID_STATUSES,
};

