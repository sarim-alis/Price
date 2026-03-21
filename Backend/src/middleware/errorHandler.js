export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV === 'production') {
    res.status(statusCode).json({
      success: false,
      message: statusCode === 500 ? 'Internal Server Error' : message,
    });
  } else {
    res.status(statusCode).json({
      success: false,
      message,
      stack: err.stack,
    });
  }
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
