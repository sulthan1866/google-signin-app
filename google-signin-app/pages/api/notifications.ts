// pages/api/send-notification.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const FCM_SERVER_KEY = process.env.NEXT_PUBLIC_FCM_KEY || 'YOUR_FIREBASE_SERVER_KEY';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { token, title, body } = req.body;

  if (!token || !title || !body) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const message = {
      to: token,
      notification: {
        title,
        body,
      },
      data: {
        customData: 'value',
      },
    };

    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Authorization': `key=${FCM_SERVER_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const responseData = await response.json();

    res.status(200).json({ success: true, response: responseData });
  } catch (err) {
    console.error('FCM send error:', err);
    res.status(500).json({ error: 'Failed to send notification' });
  }
}
