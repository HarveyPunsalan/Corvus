import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth';
import { findUserById, sanitizeUser } from '../services/user';
import { AppError } from './errorHandler';

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    const user = await findUserById(payload.userId);

    if (!user) throw new AppError(401, 'User no longer exists');

    req.user = sanitizeUser(user);
    next();

  } catch (error) {
    next(error);
  }
}