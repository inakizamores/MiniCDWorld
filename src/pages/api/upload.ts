import { NextApiRequest, NextApiResponse } from 'next';
import { handleUpload } from '@vercel/blob/client';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    const jsonResponse = await handleUpload({
      request,
      response,
      // Optional: Set a maximum file size
      options: {
        access: 'public',
        maxUploadSizeBytes: 5 * 1024 * 1024, // 5MB
      },
    });

    return response.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Error in upload handler:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
} 