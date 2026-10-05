import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendContact } from '../lib/sendContact';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim() || 'unknown';
  const { status, body } = await sendContact(req.body ?? {}, ip);
  return res.status(status).json(body);
}
