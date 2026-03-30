import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/auth';
import { PostCreateSchema, PostUpdateSchema } from '../schemas/post';

import {
  getAllPosts,
  getPostById,
  getPostsByUser,
  createPost,
  updatePost,
  deletePost,
} from '../services/post';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 10;
    const posts = await getAllPosts(skip, limit);
    res.json(posts);
  } catch (error) { next(error); }
});

router.get('/my-posts', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await getPostsByUser(req.user!.id);
    res.json(posts);
  } catch (error) { next(error); }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await getPostById(Number(req.params.id));
    res.json(post);
  } catch (error) { next(error); }
});

router.post('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = PostCreateSchema.parse(req.body);
    const post = await createPost(data, req.user!.id);
    res.status(201).json(post);
  } catch (error) { next(error); }
});

router.put('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = PostUpdateSchema.parse(req.body);
    const post = await updatePost(Number(req.params.id), data, req.user!.id);
    res.json(post);
  } catch (error) { next(error); }
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deletePost(Number(req.params.id), req.user!.id);
    res.status(204).send();
  } catch (error) { next(error); }
});

export default router;