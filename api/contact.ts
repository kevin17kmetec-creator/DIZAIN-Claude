import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendContact } from '../lib/sendContact.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim() || 'unknown';
  try {
    let payload: unknown = req.body ?? {};
    if (typeof payload === 'string') payload = JSON.parse(payload);
    const { status, body } = await sendContact(payload as Record<string, unknown>, ip);
    return res.status(status).json(body);
  } catch (err) {
    console.error('Contact handler error:', err);
    return res.status(500).json({ error: 'Pošiljanje ni uspelo. Poskusite znova.' });
  }
}
