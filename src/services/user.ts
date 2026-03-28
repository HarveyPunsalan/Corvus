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