const requestStore = new Map();

const idempotencyMiddleware = (req, res, next) => {
  const key = req.headers["idempotency-key"];

  if (!key) {
    return res.status(400).json({
      message: "Missing Idempotency-Key",
    });
  }

  /* DUPLICATE REQUEST */
  if (requestStore.has(key)) {
    return res.status(409).json({
      message: "Duplicate request detected",
    });
  }

  /* SAVE KEY */
  requestStore.set(key, true);

  setTimeout(() => {
    requestStore.delete(key);
  }, 20000);

  next();
};

export default idempotencyMiddleware;