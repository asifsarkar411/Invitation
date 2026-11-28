const { database, json, authorized } = require('../lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.setHeader('Allow', 'GET, POST');
    return json(res, 405, { error: 'Method not allowed' });
  }
  const action = req.query?.action;
  if (action === 'login' && req.method === 'POST') {
    let body = {};
    try {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      body = JSON.parse(Buffer.concat(chunks).toString() || '{}');
    } catch { return json(res, 400, { error: 'Invalid request' }); }
    if (!process.env.ADMIN_PASSWORD) return json(res, 503, { error: 'Admin access is not configured.' });
    if (body.password !== process.env.ADMIN_PASSWORD) return json(res, 401, { error: 'Incorrect password or admin is not configured.' });
    return json(res, 200, { ok: true });
  }
  if (action === 'rsvps' && req.method === 'GET') {
    if (!authorized(req)) return json(res, 401, { error: 'Unauthorized' });
    try {
      const rows = await (await database()).collection('rsvps')
        .find({}, { projection: { name: 1, attending: 1, createdAt: 1 } })
        .sort({ createdAt: -1 }).limit(500).toArray();
      return json(res, 200, rows.map(({ name, attending, createdAt }) => ({ name, attending, createdAt })));
    } catch (error) {
      console.error('Could not load RSVPs:', error.message);
      return json(res, 503, { error: 'RSVP storage is unavailable' });
    }
  }
  return json(res, 404, { error: 'Not found' });
};
