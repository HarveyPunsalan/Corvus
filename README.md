# Corvus 🐦‍⬛

A social media backend API built with Node.js, Express, and TypeScript, using Supabase as the database.

The name comes from the raven (Corvus corax) — known for communication, memory, and being surprisingly intelligent for its size. Felt right for a project about connecting people.

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

## Prerequisites

Things you need installed on your machine before anything else.

**Node.js** (v18 or higher)
Download from https://nodejs.org — grab the LTS version.
