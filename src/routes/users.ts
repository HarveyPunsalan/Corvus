import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  res.json(req.user);
});

export default router;