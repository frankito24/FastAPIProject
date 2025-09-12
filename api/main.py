# FastAPI main app
from fastapi import FastAPI
from fastapi.security import HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
import os
from sqlmodel import SQLModel, create_engine
from dotenv import load_dotenv
from api.simple_auto_crud import SimpleAutoCRUD

load_dotenv()  # carga variables de entorno
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL, echo=True)

app = FastAPI(
    title="Education & Health API",
    description="API REST automática para modelos de educación y salud con autenticación Bearer Token",
    version="1.0.0",
    # Configurar esquema de seguridad para Swagger
    openapi_tags=[
        {
            "name": "Authentication",
            "description": "Endpoints protegidos requieren Bearer Token en header Authorization"
        }
    ]
)

# Configurar CORS para permitir solicitudes desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Definir esquema de seguridad Bearer Token para Swagger UI
security = HTTPBearer()

# Generador automático de APIs REST (similar a @RepositoryRestResource)
auto_crud = SimpleAutoCRUD(app)
auto_crud.auto_discover_models()

@app.get("/")
def read_root():
    return {"message": "Hello from API module!"}

@app.get("/endpoints")
def get_endpoints():
    """Endpoint para ver todas las APIs generadas automáticamente"""
    return {
        "message": "APIs REST generadas automáticamente",
        "total_endpoints": len(auto_crud.get_generated_endpoints()),
        "endpoints": auto_crud.get_generated_endpoints(),
        "authentication": {
            "public_endpoints": "GET endpoints - No requieren autenticación",
            "protected_endpoints": "POST, PUT, DELETE - Requieren Bearer Token",
            "format": "Authorization: Bearer {API_KEY}",
            "api_key": "Configure en .env como API_KEY"
        }
    }

# Endpoint para migraciones
@app.post("/migrate")
def migrate():
    SQLModel.metadata.create_all(engine)
    return {"message": "Migraciones ejecutadas"}
