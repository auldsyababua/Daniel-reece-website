// Email validation
exports.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation
exports.isValidPhone = (phone) => {
  // Allow various phone formats, but at least 10 digits
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  const digitsOnly = phone.replace(/\D/g, '');
  return phoneRegex.test(phone) && digitsOnly.length >= 10;
};

// Input sanitization
exports.sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// Standard CORS headers
exports.corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

// Rate limiting helper (simple in-memory store)
const requestCounts = new Map();

exports.checkRateLimit = (identifier, maxRequests = 10, windowMs = 60000) => {
  const now = Date.now();
  const userRequests = requestCounts.get(identifier) || [];
  
  // Clean old requests
  const recentRequests = userRequests.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return false; // Rate limit exceeded
  }
  
  recentRequests.push(now);
  requestCounts.set(identifier, recentRequests);
  
  // Clean up old entries periodically
  if (requestCounts.size > 1000) {
    for (const [key, requests] of requestCounts.entries()) {
      if (requests.every(time => now - time > windowMs)) {
        requestCounts.delete(key);
      }
    }
  }
  
  return true; // Request allowed
};