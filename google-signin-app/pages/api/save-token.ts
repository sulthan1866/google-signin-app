
import type { NextApiRequest, NextApiResponse } from 'next';

const deviceTokens: string[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { token } = req.body;
    if (token && !deviceTokens.includes(token)) {
      deviceTokens.push(token);
    }
    return res.status(200).json({ token });
  }

  res.status(405).json({ error: 'Method not allowed' });
}

