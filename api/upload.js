import supabase from './db-client.js';
import { randomUUID } from 'node:crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { fileBase64, contentType } = req.body || {};
    if (typeof fileBase64 !== 'string' || !['image/jpeg', 'image/png', 'image/webp'].includes(contentType)) return res.status(400).json({ error: 'Invalid image' });
    const buffer = Buffer.from(fileBase64, 'base64');
    if (buffer.length < 1 || buffer.length > 5 * 1024 * 1024) return res.status(400).json({ error: 'Image must be under 5 MB' });
    const ext = contentType === 'image/png' ? 'png' : contentType === 'image/webp' ? 'webp' : 'jpg';
    const path = `uploads/${randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from('dahra-media').upload(path, buffer, { contentType, upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from('dahra-media').getPublicUrl(path);
    return res.status(201).json({ url: data.publicUrl });
  } catch (error) {
    console.error('Upload API error:', error);
    return res.status(500).json({ error: error.message || 'Upload failed' });
  }
}
