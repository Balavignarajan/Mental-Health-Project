/**
 * Calculate age from date of birth
 * @param {Date|string} dobValue - Date of birth
 * @returns {number|null} - Age in years or null if invalid
 */
function calculateAge(dobValue) {
  if (!dobValue) return null;
  
  try {
    const nowDate = new Date();
    const birthDate = new Date(dobValue);
    
    if (isNaN(birthDate.getTime())) return null;
    
    let ageValue = nowDate.getFullYear() - birthDate.getFullYear();
    const m = nowDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && nowDate.getDate() < birthDate.getDate())) {
      ageValue -= 1;
    }
    
    return ageValue;
  } catch (error) {
    return null;
  }
}

/**
 * Check eligibility - only supports simple minAge
 * @param {Object} userDoc - User document
 * @param {Object} testDoc - Test document
 * @param {Object} participantInfo - Participant info for anonymous users (optional)
 * @returns {Object} - { ok: boolean, reason: string }
 */
function checkEligibility(userDoc, testDoc, participantInfo = null) {
  const rules = testDoc.eligibilityRules || {};

  // If no rules, user is eligible
  if (!rules || Object.keys(rules).length === 0) {
    return { ok: true };
  }

  // Only support simple minAge
  if (rules.minAge !== undefined) {
    // Get DOB from participantInfo (for anonymous users) or userDoc.profile (for logged-in users)
    let dobValue = null;
    
    if (participantInfo && participantInfo.dateOfBirth) {
      dobValue = participantInfo.dateOfBirth;
    } else if (userDoc && userDoc.profile && userDoc.profile.dob) {
      dobValue = userDoc.profile.dob;
    }
    
    const ageValue = calculateAge(dobValue);
    
    if (ageValue === null) {
      return { ok: false, reason: "Date of birth is required for eligibility check. Please update your profile with your date of birth." };
    }
    
    if (ageValue < rules.minAge) {
      return { ok: false, reason: `Minimum age requirement is ${rules.minAge} years. You are ${ageValue} years old.` };
    }
    
    return { ok: true };
  }

  return { ok: true };
}

module.exports = { 
  checkEligibility,
  calculateAge
};
