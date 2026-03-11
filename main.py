from fastapi import FastAPI
from routers import auth

app = FastAPI(
    title="Corvus",
    description="A mini social backend media",
    version="1.0.0",
)

app.include_router(auth.router)

@app.get("/health")
async def health_check():
    return {"status": "ok",     "message": "Server is running"}

