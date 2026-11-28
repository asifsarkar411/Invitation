const { database, json, readBody } = require('../lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed' });
  }
  try {
    const body = await readBody(req);
    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 100) : '';
    const attending = body.attending;
    if (!name || !['yes', 'no'].includes(attending)) return json(res, 400, { error: 'Please enter your name and choose yes or no.' });
    await (await database()).collection('rsvps').insertOne({ name, attending, createdAt: new Date() });
    return json(res, 201, { ok: true });
  } catch (error) {
    console.error('Could not save RSVP:', error.message);
    return json(res, 503, { error: 'RSVP storage is unavailable' });
  }
};
