import multer from "multer";

/**
 * Centralized error handler — must be registered last in server.js, after
 * all routes and the 404 handler. Anything passed to next(error) anywhere
 * in the app (controllers, middleware, or Express itself) ends up here.
 *
 * Controllers like reportController.js already handle their most common,
 * expected errors (validation, duplicate tracking ID) inline and return
 * early — this only needs to catch what slips through: unexpected
 * Mongoose errors, malformed request bodies, stray Multer errors, and
 * anything truly unhandled.
 */
function errorHandler(err, req, res, next) {
  // If a response has already started streaming, hand off to Express's
  // built-in handler rather than trying to send a second response.
  if (res.headersSent) {
    return next(err);
  }

  const isDev = process.env.NODE_ENV !== "production";

  // Always log server-side, regardless of what we tell the client.
  console.error(`[errorHandler] ${req.method} ${req.originalUrl} ->`, err);

  // Mongoose validation error (defensive — most are already caught in controllers).
  if (err.name === "ValidationError") {
    const errors = Object.fromEntries(
      Object.entries(err.errors || {}).map(([field, fieldError]) => [field, fieldError.message])
    );
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors,
    });
  }

  // Mongoose CastError — malformed ObjectId or wrong type in a query/param.
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid value for '${err.path}'.`,
    });
  }

  // MongoDB duplicate key error (defensive — Report creation already handles this).
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({
      success: false,
      message: `A record with that ${field} already exists.`,
    });
  }

  // Malformed JSON body (express.json() throws a SyntaxError before routes run).
  if (err.type === "entity.parse.failed" || err instanceof SyntaxError) {
    return res.status(400).json({
      success: false,
      message: "Request body contains malformed JSON.",
    });
  }

  // Stray Multer errors not already normalized by middleware/upload.js.
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message || "File upload failed.",
    });
  }

  // Fallback — anything unrecognized.
  const statusCode = err.statusCode || err.status || 500;
  return res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Something went wrong on our end. Please try again." : err.message,
    ...(isDev && { stack: err.stack }),
  });
}

export default errorHandler;