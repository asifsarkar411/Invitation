const { database, json, readBody, authorized } = require('../lib/db');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const db = await database();
      const record = await db.collection('site').findOne({ _id: 'homepage' });
      return json(res, 200, { content: record?.content || null });
    } catch (error) {
      console.error('Could not load homepage content:', error.message);
      return json(res, 503, { error: 'Homepage storage is unavailable' });
    }
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return json(res, 405, { error: 'Method not allowed' });
  }
  if (!authorized(req)) return json(res, 401, { error: 'Unauthorized' });
  try {
    const content = await readBody(req);
    if (!content || typeof content !== 'object' || Array.isArray(content)) return json(res, 400, { error: 'Invalid content' });
    await (await database()).collection('site').updateOne(
      { _id: 'homepage' },
      { $set: { content, updatedAt: new Date() } },
      { upsert: true }
    );
    return json(res, 200, { ok: true });
  } catch (error) {
    console.error('Could not save homepage content:', error.message);
    return json(res, 503, { error: 'Homepage storage is unavailable' });
  }
};
