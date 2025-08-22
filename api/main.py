# FastAPI main app
from fastapi import FastAPI
import os
from sqlmodel import SQLModel, create_engine
from dotenv import load_dotenv

load_dotenv()  # carga variables de entorno
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL, echo=True)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from API module!"}

# Endpoint para migraciones
@app.post("/migrate")
def migrate():
    SQLModel.metadata.create_all(engine)
    return {"message": "Migraciones ejecutadas"}
