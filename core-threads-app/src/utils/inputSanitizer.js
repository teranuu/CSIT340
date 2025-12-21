/**
 * Input Sanitization & Validation Utility
 * 🔒 Prevents XSS, SQL Injection, and other malicious input attacks
 */

/**
 * Sanitizes text input by removing potential XSS vectors
 * @param {string} input - Raw user input
 * @param {number} maxLength - Maximum allowed length (default: 256)
 * @returns {string} Sanitized input
 */
export const sanitizeText = (input, maxLength = 256) => {
  if (!input) return '';
  
  // Convert to string and trim
  let text = String(input).trim();
  
  // Remove null bytes and control characters
  text = text.replace(/[\x00-\x1F\x7F]/g, '');
  
  // Escape HTML special characters
  const htmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  
  text = text.replace(/[&<>"'\/]/g, char => htmlEscapeMap[char]);
  
  // Limit length
  return text.slice(0, maxLength);
};

/**
 * Sanitizes search queries - allows only alphanumeric, spaces, and basic punctuation
 * @param {string} query - Search query from user
 * @param {number} maxLength - Maximum allowed length (default: 100)
 * @returns {string} Sanitized search query
 */
export const sanitizeSearchQuery = (query, maxLength = 100) => {
  if (!query) return '';
  
  let sanitized = String(query).trim();
  
  // Remove potentially dangerous characters but allow common search operators
  sanitized = sanitized.replace(/[<>"{};\\`]/g, '');
  
  // Remove null bytes and control characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');
  
  // Remove multiple consecutive spaces
  sanitized = sanitized.replace(/\s+/g, ' ');
  
  return sanitized.slice(0, maxLength);
};

/**
 * Sanitizes email input
 * @param {string} email - Email address
 * @returns {string} Sanitized email
 */
export const sanitizeEmail = (email) => {
  if (!email) return '';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmed = String(email).trim().toLowerCase();
  
  if (!emailRegex.test(trimmed)) {
    return '';
  }
  
  return trimmed.slice(0, 254); // RFC 5321 max email length
};

/**
 * Validates and sanitizes username
 * Rules: 3-20 characters, alphanumeric and underscore only
 * @param {string} username - Username input
 * @returns {object} { isValid: boolean, value: string, error: string }
 */
export const sanitizeUsername = (username) => {
  if (!username) {
    return { isValid: false, value: '', error: 'Username is required' };
  }
  
  const sanitized = String(username).trim();
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  
  if (!usernameRegex.test(sanitized)) {
    return {
      isValid: false,
      value: sanitized,
      error: 'Username must be 3-20 characters, alphanumeric and underscore only'
    };
  }
  
  return { isValid: true, value: sanitized, error: null };
};

/**
 * Validates and sanitizes password
 * Rules: 6+ chars, at least one non-letter character
 * @param {string} password - Password input
 * @returns {object} { isValid: boolean, error: string }
 */
export const sanitizePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  const pwd = String(password);
  
  if (pwd.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters' };
  }
  
  if (pwd.match(/^[A-Za-z]+$/)) {
    return { isValid: false, error: 'Password must include at least one number or symbol' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Sanitizes URL parameters to prevent injection
 * @param {string} param - URL parameter
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} Sanitized parameter
 */
export const sanitizeUrlParam = (param, maxLength = 100) => {
  if (!param) return '';
  
  const decoded = decodeURIComponent(String(param));
  
  // Remove special characters that could be used in injection attacks
  const sanitized = decoded.replace(/[<>"'{};\\`]/g, '');
  
  return sanitized.slice(0, maxLength);
};

/**
 * Sanitizes numeric input
 * @param {*} value - Numeric value
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number|null} Sanitized number or null if invalid
 */
export const sanitizeNumber = (value, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const num = Number(value);
  
  if (!Number.isFinite(num)) return null;
  if (num < min || num > max) return null;
  
  return num;
};

/**
 * Sanitizes object keys to prevent object injection
 * @param {object} obj - Object to sanitize
 * @returns {object} Sanitized object
 */
export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return {};
  
  const sanitized = {};
  
  Object.keys(obj).forEach(key => {
    // Only allow alphanumeric, underscore, and hyphen in keys
    if (/^[a-zA-Z0-9_-]+$/.test(key)) {
      const value = obj[key];
      
      if (typeof value === 'string') {
        sanitized[key] = sanitizeText(value);
      } else if (typeof value === 'number') {
        sanitized[key] = value;
      } else if (typeof value === 'boolean') {
        sanitized[key] = value;
      } else if (value === null) {
        sanitized[key] = null;
      }
    }
  });
  
  return sanitized;
};

/**
 * Escapes HTML content for safe display
 * @param {string} text - Text to escape
 * @returns {string} Escaped text safe for HTML
 */
export const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
};

/**
 * Validates file uploads
 * @param {object} file - File object from input
 * @param {Array<string>} allowedTypes - Allowed MIME types
 * @param {number} maxSizeBytes - Maximum file size in bytes
 * @returns {object} { isValid: boolean, error: string }
 */
export const sanitizeFileUpload = (
  file,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
  maxSizeBytes = 5 * 1024 * 1024
) => {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }
  
  // Check file size
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File size exceeds limit (${maxSizeBytes / (1024 * 1024)}MB)`
    };
  }
  
  // Check MIME type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'File type not allowed'
    };
  }
  
  // Check file extension (additional layer of validation)
  const validExtensions = allowedTypes
    .map(type => type.split('/')[1])
    .map(ext => `.${ext}`);
  
  const fileName = String(file.name).toLowerCase();
  const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
  
  if (!hasValidExtension) {
    return {
      isValid: false,
      error: 'File extension does not match file type'
    };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validates and sanitizes form data
 * @param {object} formData - Form data object
 * @param {object} schema - Validation schema
 * @returns {object} { isValid: boolean, sanitized: object, errors: object }
 */
export const validateFormData = (formData, schema) => {
  const sanitized = {};
  const errors = {};
  let isValid = true;
  
  Object.keys(schema).forEach(field => {
    const value = formData[field];
    const rules = schema[field];
    
    try {
      if (rules.required && (!value || String(value).trim() === '')) {
        errors[field] = `${field} is required`;
        isValid = false;
        return;
      }
      
      if (rules.type === 'email') {
        const sanitized_email = sanitizeEmail(value);
        if (!sanitized_email) {
          errors[field] = 'Invalid email address';
          isValid = false;
          return;
        }
        sanitized[field] = sanitized_email;
      } else if (rules.type === 'text') {
        sanitized[field] = sanitizeText(value, rules.maxLength || 256);
      } else if (rules.type === 'number') {
        const num = sanitizeNumber(value, rules.min, rules.max);
        if (num === null) {
          errors[field] = `${field} must be a valid number`;
          isValid = false;
          return;
        }
        sanitized[field] = num;
      } else if (rules.type === 'password') {
        const pwdValidation = sanitizePassword(value);
        if (!pwdValidation.isValid) {
          errors[field] = pwdValidation.error;
          isValid = false;
          return;
        }
        sanitized[field] = String(value);
      } else if (rules.type === 'username') {
        const userValidation = sanitizeUsername(value);
        if (!userValidation.isValid) {
          errors[field] = userValidation.error;
          isValid = false;
          return;
        }
        sanitized[field] = userValidation.value;
      } else {
        sanitized[field] = sanitizeText(value, rules.maxLength || 256);
      }
    } catch (error) {
      errors[field] = `Error validating ${field}`;
      isValid = false;
    }
  });
  
  return { isValid, sanitized, errors };
};

export default {
  sanitizeText,
  sanitizeSearchQuery,
  sanitizeEmail,
  sanitizeUsername,
  sanitizePassword,
  sanitizeUrlParam,
  sanitizeNumber,
  sanitizeObject,
  escapeHtml,
  sanitizeFileUpload,
  validateFormData
};
