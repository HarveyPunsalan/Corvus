import { Router, Request, Response, NextFunction } from 'express';
import { RegisterSchema, LoginSchema } from '../schemas/user';
import { createUser, findUserByUsername } from '../services/user';
import { verifyPassword, createToken } from '../services/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = RegisterSchema.parse(req.body);
    const user = await createUser(data);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = LoginSchema.parse(req.body);
    const user = await findUserByUsername(data.username);

    if (!user) throw new AppError(401, 'Incorrect username or password');

    const passwordOk = await verifyPassword(data.password, user.hashedPassword);

    if (!passwordOk) throw new AppError(401, 'Incorrect username or password');

    const token = createToken({ userId: user.id, username: user.username });

    res.json({ access_token: token, token_type: 'bearer' });
  } catch (error) {
    next(error);
  }
});

export default router;