import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from '../services/user';

const router = Router();

// -- GET MY PROFILE (protected) --
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  res.json(req.user);
});

// -- FOLLOW A USER (protected) --
// POST /users/5/follow → you (logged in) follow user with id 5
// req.user!.id = you (the follower)
// req.params.id = the person you want to follow
router.post('/:id/follow', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await followUser(req.user!.id, Number(req.params.id));
    res.status(201).json(result);
  } catch (error) { next(error); }
});

// -- UNFOLLOW A USER (protected) --
// DELETE /users/5/unfollow → you stop following user with id 5
router.delete('/:id/unfollow', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await unfollowUser(req.user!.id, Number(req.params.id));
    res.json({ message: 'Unfollowed' });
  } catch (error) { next(error); }
});

// -- GET FOLLOWERS (public) --
// GET /users/5/followers → list of people who follow user 5
// No auth needed - anyone can see who follows who
router.get('/:id/followers', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const followers = await getFollowers(Number(req.params.id));
    res.json(followers);
  } catch (error) { next(error); }
});

// -- GET FOLLOWING (public) --
// GET /users/5/following → list of people user 5 is following
router.get('/:id/following', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const following = await getFollowing(Number(req.params.id));
    res.json(following);
  } catch (error) { next(error); }
});

export default router;