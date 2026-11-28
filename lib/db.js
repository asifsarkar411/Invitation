const { MongoClient } = require('mongodb');

let clientPromise;
async function database() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not configured');
  if (!clientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI);
    clientPromise = client.connect();
  }
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB || 'asif_sayma_invitation');
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 100_000) reject(new Error('Request is too large'));
    });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

function authorized(req) {
  const expected = process.env.ADMIN_PASSWORD;
  const supplied = req.headers['x-admin-password'];
  return Boolean(expected && supplied && supplied === expected);
}

module.exports = { database, json, readBody, authorized };
