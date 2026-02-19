from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import engine, Base
from routes import linkedin, content

app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(linkedin.router)
app.include_router(content.router)


@app.get("/")
def home():
    return {"message": "LinkedIn Poster Running"}