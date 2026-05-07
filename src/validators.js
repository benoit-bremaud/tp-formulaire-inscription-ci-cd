/**
 * Calculates the age in full years from a birth date.
 * @param {Date} birthDate - The birth date as a JavaScript Date object.
 * @returns {number} The age in full years.
 */
export function calculateAge(birthDate) {
    if (!(birthDate instanceof Date)) {
        throw new Error('birthDate must be a Date');
    }
    if (isNaN(birthDate.getTime())) {
        throw new Error('birthDate is invalid');
    }
  const today = new Date();
  let age = today.getUTCFullYear() - birthDate.getUTCFullYear();
  const monthDiff = today.getUTCMonth() - birthDate.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getUTCDate() < birthDate.getUTCDate())) {
    age--;
  }
  return age;
}

/**
 * Checks if the user is at least 18 years old.
 * @param {Date} birthDate - The birth date as a JavaScript Date object.
 * @returns {boolean} True if age is 18 or more.
 * @throws {Error} Delegates input validation to calculateAge.
 */
export function isAdult(birthDate) {
  return calculateAge(birthDate) >= 18;
}

/**
 * Checks if a value is a valid name.
 * Accepts only letters (with accents), spaces, hyphens and apostrophes.
 * @param {string} value - The value to validate.
 * @returns {boolean} True if the value is a valid name.
 */
export function isValidName(value) {
  if (typeof value !== 'string') {
    return false;
  }
  return /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(value);
}

/**
 * Checks if a value is a valid French postal code (exactly 5 digits).
 * @param {string} value - The value to validate.
 * @returns {boolean} True if valid.
 */
export function isValidPostalCode(value) {
  if (typeof value !== 'string') {
    return false;
  }
  return /^\d{5}$/.test(value);
}

/**
 * Checks if a value is a valid email address (simple format).
 * @param {string} value - The value to validate.
 * @returns {boolean} True if valid.
 */
export function isValidEmail(value) {
  if (typeof value !== 'string') {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
