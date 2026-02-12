// ===========================================
// API Response Helper - Consistent format
// ===========================================

/**
 * Send a success response.
 * @param {import('express').Response} res
 * @param {object} data
 * @param {string} message
 * @param {number} statusCode
 */
const sendSuccess = (res, data = {}, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {string} message
 * @param {number} statusCode
 * @param {object} errors
 */
const sendError = (res, message = 'Something went wrong', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    data: null,
    message,
  };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

module.exports = { sendSuccess, sendError };
