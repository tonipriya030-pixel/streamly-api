// errorHandler.js
//
// TASK 4 — The ONE place every error is turned into an HTTP response.
// Express recognises this as the error handler ONLY because it has FOUR
// parameters: (err, req, res, next). Keep all four, even if you don't use next.
//
// Map each error TYPE to the right status:
// ValidationError -> 400
// CastError       -> 400
// Duplicate key  -> 409
// anything else  -> 500

export function errorHandler(err, req, res, next) {

  // TODO 4a: Validation Error
  // Mongoose validation errors contain an `errors` object.
  // We create a simple { field: message } map.
  if (err.name === "ValidationError") {
    const fields = {};

    for (const key in err.errors) {
      fields[key] = err.errors[key].message;
    }

    return res.status(400).json({
      error: "ValidationError",
      fields
    });
  }

  // TODO 4b: Cast Error
  // Happens when an invalid MongoDB ObjectId is provided.
  if (err.name === "CastError") {
    return res.status(400).json({
      error: "CastError",
      message: "Invalid ID format",
      field: err.path
    });
  }

  // TODO 4c: Duplicate Key Error
  // MongoDB uses error code 11000 for duplicate values.
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];

    return res.status(409).json({
      error: "DuplicateKey",
      message: field + " already exists",
      field
    });
  }

  // Fallback — unknown/unexpected error.
  // Log the real error, but don't expose its details to the client.
  console.error(err);

  return res.status(500).json({
    error: "InternalServerError"
  });
}