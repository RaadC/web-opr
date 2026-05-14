import rateLimit from "express-rate-limit";

//limit1
export const strictLimiter = rateLimit({
  windowMs: 10 * 1000, // 10s
  max: 2,

  message: {
    message: "Too many requests. Please wait a few seconds.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

//limit2
export const getLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 10,

  message: {
    message: "Too many refresh requests.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});
