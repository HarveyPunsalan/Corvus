# Corvus 🐦‍⬛

A full stack social media app built with Node.js, Express, TypeScript, and React. The backend is a REST API connected to a real PostgreSQL database through Supabase. The frontend is a React app that talks to it.

---

## What is this?

Corvus is a practice project. I built it to get comfortable with TypeScript on both the backend and frontend, work with a supabase instead of SQLite, and actually connect the two ends together into something that works end to end.

No tutorials followed. Just me figuring things out, breaking things, and fixing them.

---

## Features

- User registration and login with JWT authentication
- Create, read, update, and delete posts
- Like and unlike posts
- Follow and unfollow other users
- Personalized feed (posts from people you follow)
- Ownership checks you can only edit or delete your own posts
- Passwords hashed with bcrypt, never stored plain

---

## Tech Stack

### Backend
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

### Frontend
| | |
|---|---|
| **Framework** | React + TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS |
| **Routing** | React Router |

---

## Live

| | |
|---|---|
| **Frontend** | https://corvus-woad.vercel.app/login |
| **Backend** | https://corvus-api-flnx.onrender.com |

> Both are on free tiers. The backend on Render may take up to 50 seconds to wake up on the first request if it's been idle.

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

## Project Structure

```
Corvus/
├── src/                    # Backend
│   ├── index.ts
│   ├── routes/
│   ├── services/
│   ├── schemas/
│   ├── middleware/
│   ├── lib/
│   └── types/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── client/                 # Frontend
    └── src/
        ├── pages/
        ├── components/
        │   ├── layout/
        │   └── ui/
        ├── hooks/
        ├── lib/
        ├── context/
        └── types/
```

---

## Version

**v0.2.0** - Now full stack. Frontend connected to the backend and deployed.

**v0.1.0** - Core API complete. Auth, posts, likes, follows, and feed all working.
