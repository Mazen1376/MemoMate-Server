import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';


export const verifyToken = asyncHandler(async (req: any, res: any, next: any) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback_secret'
      );

      // Extract ID from the token
      req.decodedToken = decoded;
      console.log(req.decodedToken);

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});
