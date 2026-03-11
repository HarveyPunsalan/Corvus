# Corvus 🐦‍⬛

A social media backend API built with FastAPI. This is a backend project outside of school no tutorials followed, just me figuring it out.

The name comes from the raven (*Corvus corax*) known for communication, memory, and being surprisingly intelligent for its size. Felt right for a project about connecting people.

---

## What is this?

Corvus is a REST API that powers the backend of a social media platform. Users can create accounts, write posts, follow each other, and get a personalized feed. It handles authentication with JWT tokens and is built on FastAPI with a SQLite database.

I built this after finishing a Django/DRF course in school. I wanted to learn FastAPI on my own terms not by copying a YouTube tutorial, but by rebuilding something I already understood in a completely new framework.

---

## Features

- User registration and login with JWT authentication
- Create, read, update, and delete posts
- Like and unlike posts
- Follow and unfollow other users
- Personalized feed (posts from people you follow)
- Auto-generated API docs at `/docs`

---

## Tech Stack

| | |
|---|---|
| Framework | FastAPI |
| Database | SQLite |
| ORM | SQLModel |
| Migrations | Alembic |
| Auth | JWT via python-jose |
| Password Hashing | passlib + bcrypt |
| Server | Uvicorn |

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/yourusername/corvus.git
cd corvus

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create your .env file
cp .env.example .env
# Then open .env and set your own SECRET_KEY

# Run migrations
alembic upgrade head

# Start the server
uvicorn main:app --reload
```

Server runs at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

---

## Project Structure

```
corvus/
├── main.py
├── database.py
├── models/
│   ├── user.py
│   ├── post.py
│   └── follow.py
├── schemas/
│   ├── user.py
│   └── post.py
├── routers/
│   ├── auth.py
│   ├── users.py
│   └── posts.py
├── crud/
│   ├── user.py
│   └── post.py
└── core/
    ├── config.py
    └── security.py
```

---

## API Overview

### Auth
```
POST   /auth/register
POST   /auth/login
```

### Users
```
GET    /users/me
POST   /users/{id}/follow
DELETE /users/{id}/unfollow
GET    /users/{id}/followers
GET    /users/{id}/following
```

### Posts
```
GET    /posts/
GET    /posts/feed
GET    /posts/my-posts
GET    /posts/{id}
POST   /posts/
PUT    /posts/{id}
DELETE /posts/{id}
POST   /posts/{id}/like
DELETE /posts/{id}/unlike
GET    /posts/{id}/likes
```

---

## Environment Variables

Create a `.env` file in the root directory:

```
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./corvus.db
```

---

## Status

Still in active development. Core features work. Things I want to add next:

- [ ] Post comments
- [ ] Profile update endpoint
- [ ] Search posts by keyword
- [ ] Write proper tests with pytest
- [ ] Docker setup

---

## Why I built this

This project is me taking what I learned in school and proving I can apply it somewhere new, with a different framework, on my own.

It's not perfect but it's mine, and it works.

