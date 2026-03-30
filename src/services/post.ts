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