/**
 * Utilitaires pour la validation
 */

/**
 * Crée une erreur de validation avec le status code 400
 * @param {string} message - Message d'erreur
 * @returns {Error} Erreur avec statusCode 400
 */
function createValidationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

/**
 * Formate les erreurs Joi en un message lisible
 * @param {Joi.ValidationError} error - Erreur Joi
 * @returns {string} Message formaté
 */
function formatJoiErrors(error) {
  return error.details.map((d) => d.message).join(', ');
}

module.exports = {
  createValidationError,
  formatJoiErrors,
};

