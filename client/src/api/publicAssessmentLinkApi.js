import axiosInstance from '../utils/config/axiosInstance';

// ============================================================================
// PUBLIC ASSESSMENT LINK APIs (No authentication required)
// ============================================================================

/**
 * Validate assessment link token
 * @param {string} token - Link token
 * @returns {Promise} API response with link and test info
 */
export const validateAssessmentLink = async (token) => {
  const response = await axiosInstance.get(`/public/assessment-links/${token}/validate`);
  return response.data;
};

/**
 * Start anonymous assessment attempt via link
 * @param {string} token - Link token
 * @param {Object} participantInfo - Participant information (name, email, dateOfBirth, gender)
 * @returns {Promise} API response with attempt and test data
 */
export const startLinkAttempt = async (token, participantInfo = {}) => {
  const response = await axiosInstance.post(`/public/assessment-links/${token}/start`, {
    participantInfo
  });
  return response.data;
};

/**
 * Save answers for anonymous attempt
 * @param {string} token - Link token
 * @param {string} attemptId - Attempt ID
 * @param {Object} answers - Answers object
 * @returns {Promise} API response with updated attempt data
 */
export const saveLinkAttempt = async (token, attemptId, answers) => {
  const response = await axiosInstance.post(`/public/assessment-links/${token}/save/${attemptId}`, {
    answers
  });
  return response.data;
};

/**
 * Submit anonymous attempt
 * @param {string} token - Link token
 * @param {string} attemptId - Attempt ID
 * @param {Object} answers - Optional answers object
 * @returns {Promise} API response with result data
 */
export const submitLinkAttempt = async (token, attemptId, answers = null) => {
  const body = answers ? { answers } : {};
  const response = await axiosInstance.post(`/public/assessment-links/${token}/submit/${attemptId}`, body);
  return response.data;
};

