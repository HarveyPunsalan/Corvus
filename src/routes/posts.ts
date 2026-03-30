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
  likePost,
  unlikePost,
  getLikeCount,
  getFeed,
} from '../services/post';

const router = Router();

// -- GET ALL POSTS (public) --
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 10;
    const posts = await getAllPosts(skip, limit);
    res.json(posts);
  } catch (error) { next(error); }
});

// -- GET MY POSTS (protected) --
// IMPORTANT: static routes like /my-posts and /feed MUST come before /:id
// otherwise Express reads "my-posts" or "feed" as an id param
router.get('/my-posts', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await getPostsByUser(req.user!.id);
    res.json(posts);
  } catch (error) { next(error); }
});

// -- GET FEED (protected) --
router.get('/feed', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 20;
    const posts = await getFeed(req.user!.id, skip, limit);
    res.json(posts);
  } catch (error) { next(error); }
});

// -- GET ONE POST (public) --
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await getPostById(Number(req.params.id));
    res.json(post);
  } catch (error) { next(error); }
});

// -- GET LIKE COUNT (public) --
router.get('/:id/likes', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await getLikeCount(Number(req.params.id));
    res.json({ post_id: Number(req.params.id), likes: count });
  } catch (error) { next(error); }
});

// -- CREATE POST (protected) --
router.post('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = PostCreateSchema.parse(req.body);
    const post = await createPost(data, req.user!.id);
    res.status(201).json(post);
  } catch (error) { next(error); }
});

// -- LIKE A POST (protected) --
router.post('/:id/like', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await likePost(Number(req.params.id), req.user!.id);
    res.status(201).json({ message: 'Post liked!' });
  } catch (error) { next(error); }
});

// -- UPDATE POST (protected) --
router.put('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = PostUpdateSchema.parse(req.body);
    const post = await updatePost(Number(req.params.id), data, req.user!.id);
    res.json(post);
  } catch (error) { next(error); }
});

// -- UNLIKE A POST (protected) --
router.delete('/:id/unlike', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await unlikePost(Number(req.params.id), req.user!.id);
    res.json({ message: 'Post unliked!' });
  } catch (error) { next(error); }
});

// -- DELETE POST (protected) --
router.delete('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deletePost(Number(req.params.id), req.user!.id);
    res.status(204).send();
  } catch (error) { next(error); }
});

export default router;