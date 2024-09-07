// pages/api/middlewares/authMiddleware.ts

import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import jwt from 'jsonwebtoken';

const authMiddleware = (next: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, 'YOUR_SECRET_KEY'); // Replace with your JWT secret key
    req.body.user = decoded;

    return await next(req, res);
  } catch (err) {
    return res.status(401).json({ error: 'Token is invalid' });
  }
};

export default authMiddleware;
