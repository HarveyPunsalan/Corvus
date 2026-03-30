# Corvus 🐦‍⬛

A social media backend API built with Node.js, Express, and TypeScript, using Supabase as the database.

The name comes from the raven (Corvus corax) - known for communication, memory, and being surprisingly intelligent for its size. Felt right for a project about connecting people.

---

## What is this?

Corvus is a REST API that powers the backend of a social media platform. Users can create accounts, write posts, follow each other, and get a personalized feed. It handles authentication with JWT tokens and stores everything in a real PostgreSQL database through Supabase.

I built this outside of school. No tutorials followed just me wanting to practice TypeScript properly and get comfortable with a real SQL database instead of relying on SQLite. My mentor pushed me toward Supabase for that reason and I went with it.

---

## Features

- User registration and login with JWT authentication
- Create, read, update, and delete posts
- Like and unlike posts
- Follow and unfollow other users
- Personalized feed (posts from people you follow)
- Ownership checks — you can only edit or delete your own posts
- Passwords hashed with bcrypt, never stored plain

---

## Tech Stack

| | |
|---|---|
| **Framework** | Express.js |
| **Language** | TypeScript |
| **Database** | Supabase (PostgreSQL) |
| **ORM** | Prisma |
| **Auth** | JWT via jsonwebtoken |
| **Password Hashing** | bcryptjs |
| **Validation** | Zod |
| **Dev Server** | ts-node-dev |

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Create a new account |
| POST | `/auth/login` | ❌ | Login and get a JWT token |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/me` | ✅ | Get your own profile |
| POST | `/users/:id/follow` | ✅ | Follow a user |
| DELETE | `/users/:id/unfollow` | ✅ | Unfollow a user |
| GET | `/users/:id/followers` | ❌ | List a user's followers |
| GET | `/users/:id/following` | ❌ | List who a user follows |

### Posts
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/posts` | ❌ | List all posts (supports `?skip=0&limit=10`) |
| GET | `/posts/:id` | ❌ | Get a single post |
| GET | `/posts/my-posts` | ✅ | Get your own posts |
| GET | `/posts/feed` | ✅ | Get posts from people you follow |
| POST | `/posts` | ✅ | Create a post |
| PUT | `/posts/:id` | ✅ | Update your post |
| DELETE | `/posts/:id` | ✅ | Delete your post |
| POST | `/posts/:id/like` | ✅ | Like a post |
| DELETE | `/posts/:id/unlike` | ✅ | Unlike a post |
| GET | `/posts/:id/likes` | ❌ | Get like count on a post |

---

## Live API

Base URL: `https://corvus-api-flnx.onrender.com`

> Hosted on Render's free tier - first request may take up to 50 seconds if the service is asleep.

Try the health check:
```
https://corvus-api-flnx.onrender.com/health
```

---

## Project Structure
```
src/
├── index.ts           # Entry point
├── routes/            # Route definitions
│   ├── auth.ts
│   ├── users.ts
│   └── posts.ts
├── services/          # Business logic + database calls
│   ├── auth.ts
│   ├── users.ts
│   └── post.ts
├── schemas/           # Zod validation schemas
│   └── post.ts
├── middleware/        # Auth + error handler
│   ├── auth.ts
│   └── errorHandler.ts
├── lib/               # Prisma client
│   └── prisma.ts
└── types/             # TypeScript type extensions
    └── express.d.ts
prisma/
├── schema.prisma      # Database models
└── migrations/        # Migration history
```

---

## Version

**v0.1.0** — Core API complete. Auth, posts, likes, follows, and feed all working.

---

## Prerequisites

Things you need installed on your machine before anything else.

**Node.js** (v18 or higher)
Download from https://nodejs.org — grab the LTS version.
