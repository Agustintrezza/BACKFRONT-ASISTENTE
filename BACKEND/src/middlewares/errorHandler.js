// Not found + Error handler genérico

function notFoundHandler(req, res, _next) {
    return res.status(404).json({ error: 'Not Found', path: req.originalUrl });
  }
  
  function errorHandler(err, _req, res, _next) {
    console.error('[ERROR]', err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Error interno' });
  }
  
  module.exports = { notFoundHandler, errorHandler };
  