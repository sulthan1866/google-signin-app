import type { NextApiRequest, NextApiResponse } from 'next'

let deviceToken: string | null = null;

export default function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method === 'POST') {
    const { token } = req.body;
    if (token) {
      deviceToken = token;
      console.log('Saved device token:', token);
    }
    return res.status(200).json({ success: true });
  }

  if (req.method === 'GET') {
    // Return the latest saved token
    return res.status(200).json({ token: deviceToken });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
