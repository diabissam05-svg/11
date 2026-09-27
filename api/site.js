import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('site_documents').select('*').eq('id', 'main').single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'PUT') {
      const { payload, password } = req.body || {};
      if (!payload || typeof payload !== 'object' || !Array.isArray(payload.categories) || !Array.isArray(payload.hero)) return res.status(400).json({ error: 'Invalid site content' });
      const { data: current, error: readError } = await supabase.from('site_documents').select('*').eq('id', 'main').single();
      if (readError) throw readError;
      if (!password || password !== current.payload?.credentials?.password) return res.status(401).json({ error: 'Unauthorized' });
      const { data, error } = await supabase.from('site_documents').update({ payload, updated_at: new Date().toISOString() }).eq('id', 'main').select('*').single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Site API error:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
