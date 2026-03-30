import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { PostCreateInput, PostUpdateInput } from '../schemas/post';

// -- GET ALL POSTS --
// Public - anyone can call this, no auth needed.
// skip and limit are for pagination:
//   skip=0, limit=10 → first page (posts 1–10)
//   skip=10, limit=10 → second page (posts 11–20)
export async function getAllPosts(skip = 0, limit = 10) {
  return prisma.post.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' }, // newest posts first
    include: {
      owner: { select: { id: true, username: true } },
      // ↑ Instead of returning the raw ownerId number, i JOIN the users table
      // and return the owner's id and username alongside each post.
      // select means i only grab those two fields - not the password hash etc.
    },
  });
}

// -- GET ONE POST --
// Public — fetch a single post by its id.
// If it doesn't exist, we throw an AppError(404) instead of returning null.
// AppError is your global error handler from Phase 2 — it sends a clean
// { error: 'Post not found' } response automatically.
export async function getPostById(id: number) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: { owner: { select: { id: true, username: true } } },
  });

  if (!post) throw new AppError(404, 'Post not found');

  return post;
}

// -- GET POSTS BY A SPECIFIC USER --
// Protected - used for GET /posts/my-posts.
// Takes a userId and returns only that user's posts, newest first.
export async function getPostsByUser(userId: number) {
  return prisma.post.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: 'desc' },
  });
}

// -- CREATE A POST --
// Protected - only logged-in users can create posts.
// data comes from PostCreateSchema (title + content already validated).
// ownerId comes from req.user.id - the logged-in user's id from the JWT token.
export async function createPost(data: PostCreateInput, ownerId: number) {
  return prisma.post.create({
    data: { ...data, ownerId },
    // ↑ ...data spreads title and content, then we add ownerId on top.
    // Final object: { title, content, ownerId }
  });
}

// -- UPDATE A POST --
// Protected + ownership check.
// First i fetch the post - if it doesn't exist, getPostById throws 404.
// Then i check if the logged-in user owns it - if not, i throw 403.
export async function updatePost(
  id: number,
  data: PostUpdateInput,
  requestingUserId: number
) {
  const post = await getPostById(id); // reuses the function above

  if (post.ownerId !== requestingUserId) {
    throw new AppError(403, 'Not your post');
    // 403 = Forbidden. You're logged in, but this isn't your post.
  }

  return prisma.post.update({
    where: { id },
    data,
  });
}

// -- DELETE A POST --
// Protected + ownership check - same pattern as update.
// Returns the deleted post so the route can confirm what was removed.
export async function deletePost(id: number, requestingUserId: number) {
  const post = await getPostById(id);

  if (post.ownerId !== requestingUserId) {
    throw new AppError(403, 'Not your post');
  }

  return prisma.post.delete({
    where: { id },
  });
}

// -- LIKES --
export async function likePost(postId: number, userId: number) {
  await getPostById(postId); // reuses existing function — throws 404 if post doesn't exist

  // If the user already liked this post, Prisma throws P2002 (@@unique violation)
  // My global error handler from previous task catches P2002 and returns 409 Conflict
  await prisma.postLike.create({
    data: { userId, postId },
  });
}

export async function unlikePost(postId: number, userId: number) {
  // Check if the like actually exists first
  const like = await prisma.postLike.findUnique({
    where: { userId_postId: { userId, postId } },
    // ↑ This userId_postId is the name Prisma auto-generates for my @@unique([userId, postId])
  });

  if (!like) throw new AppError(400, 'You have not liked this post');

  await prisma.postLike.delete({
    where: { userId_postId: { userId, postId } },
  });
}

export async function getLikeCount(postId: number) {
  // Just returns the number of likes for a post - no auth needed
  return prisma.postLike.count({ where: { postId } });
}

// -- FEED --
export async function getFeed(userId: number, skip = 0, limit = 20) {
  // Step 1: Find everyone the current user follows
  const follows = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true }, // i only need their IDs
  });

  const followingIds = follows.map(f => f.followingId);
  // ↑ Transforms [{ followingId: 2 }, { followingId: 3 }] → [2, 3]

  // If not following anyone, return empty feed immediately
  if (followingIds.length === 0) return [];

  // Step 2: Get posts from those users only, newest first
  return prisma.post.findMany({
    where: { ownerId: { in: followingIds } },
    // ↑ The "in" here: [...] is like SQL's WHERE owner_id IN (2, 3)
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
    include: { owner: { select: { id: true, username: true } } },
  });
}