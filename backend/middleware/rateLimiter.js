import rateLimit from 'express-rate-limit';

// 1. General API Rate Limiter (For all routes)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per 15 minutes
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

// 2. Strict Rate Limiter for Auth Routes (Login / Register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 10, // Limit each IP to 10 login/register attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    message: 'Too many login or registration attempts. Please try again after 15 minutes.',
  },
});

// 3. Upload Rate Limiter (For Video / File Uploads)
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 15, // Limit each IP to 15 video uploads per hour
  standardHeaders: true,
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    message: 'Upload limit reached. You can only upload 15 videos per hour.',
  },
});