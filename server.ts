import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { sendContact } from './lib/sendContact';

// Lokalni razvojni strežnik. Na Vercelu se uporablja api/contact.ts.
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50kb' }));

  app.post('/api/contact', async (req, res) => {
    const { status, body } = await sendContact(req.body ?? {}, req.ip || 'local');
    res.status(status).json(body);
  });

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
