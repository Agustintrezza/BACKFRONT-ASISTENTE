'use strict';

/**
 * Detecta el tenant a partir de:
 * 1) query ?tenant=ACME
 * 2) headers: x-tenant o x-tenant-id
 * 3) subdominio (acme.tu-dominio.com) — opcional
 * 4) variable de entorno DEFAULT_TENANT (fallback: "default")
 */
function tenantResolver(req, _res, next) {
  const q = typeof req.query?.tenant === 'string' ? req.query.tenant.trim() : '';
  const h1 = typeof req.headers['x-tenant'] === 'string' ? req.headers['x-tenant'].trim() : '';
  const h2 = typeof req.headers['x-tenant-id'] === 'string' ? req.headers['x-tenant-id'].trim() : '';
  const env = process.env.DEFAULT_TENANT || 'default';

  let tenant = q || h1 || h2;

  // Inferir por subdominio si no vino explícito
  if (!tenant) {
    const host = req.headers?.host || '';
    if (host && host.includes('.')) {
      const sub = host.split('.')[0];
      if (sub && sub !== 'www' && sub !== 'localhost') {
        tenant = sub;
      }
    }
  }

  req.tenant = tenant || env;
  next();
}

module.exports = { tenantResolver };
