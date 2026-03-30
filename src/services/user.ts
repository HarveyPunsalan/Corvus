import { prisma } from '../lib/prisma';
import { hashPassword } from './auth';
import { AppError } from '../middleware/errorHandler';
import { User } from '../generated/prisma/client';

export function sanitizeUser(user: User) {
  const { hashedPassword, ...safe } = user;
  return safe;
}

export async function findUserByUsername(username: string) {
  return prisma.user.findUnique({ where: { username } });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id: number) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(data: {
  username: string;
  email: string;
  password: string;
}) {
  const existingUsername = await findUserByUsername(data.username);
  if (existingUsername) throw new AppError(409, 'Username already taken');

  const existingEmail = await findUserByEmail(data.email);
  if (existingEmail) throw new AppError(409, 'Email already registered');

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      hashedPassword,
    },
  });

  return sanitizeUser(user);
}

// -- FOLLOW --
export async function followUser(followerId: number, followingId: number) {
  if (followerId === followingId) {
    throw new AppError(400, 'You cannot follow yourself');
  }

  // Check if the target user actually exists
  const target = await findUserById(followingId);
  if (!target) throw new AppError(404, 'User not found');

  // If already following, Prisma throws P2002 (@@unique violation)
  // My global error handler catches that and returns 409 Conflict
  await prisma.follow.create({
    data: { followerId, followingId },
  });

  return { message: `Now following ${target.username}` };
}

export async function unfollowUser(followerId: number, followingId: number) {
  // Check if the follow relationship actually exists first
  const follow = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
    // ↑ Prisma auto-generates this name from my @@unique([followerId, followingId])
  });

  if (!follow) throw new AppError(400, 'Not following this user');

  await prisma.follow.delete({
    where: { followerId_followingId: { followerId, followingId } },
  });
}

export async function getFollowers(userId: number) {
  // Find all Follow rows where someone is following this user
  const follows = await prisma.follow.findMany({
    where: { followingId: userId },
    include: { follower: { select: { id: true, username: true, email: true } } },
  });

  return follows.map(f => f.follower);
}

export async function getFollowing(userId: number) {
  // Find all Follow rows where this user is following someone
  const follows = await prisma.follow.findMany({
    where: { followerId: userId },
    include: { following: { select: { id: true, username: true, email: true } } },
  });

  return follows.map(f => f.following);
}