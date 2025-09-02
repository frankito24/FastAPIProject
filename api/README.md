# API Module README

## 🚀 Sistema Automático de APIs REST con Autenticación

Este proyecto implementa un sistema automático de generación de APIs REST similar a `@RepositoryRestResource` de Spring Boot. El sistema descubre automáticamente todos los modelos SQLAlchemy y genera endpoints REST completos para cada uno.

### 🔐 Sistema de Autenticación
- **Endpoints públicos**: GET (lectura) - No requieren autenticación
- **Endpoints protegidos**: POST, PUT, DELETE - Requieren **Bearer Token** en headers
- **API Key**: Se configura en el archivo `.env` como `API_KEY`
- **Formato requerido**: `Authorization: Bearer {API_KEY}`

### ✨ Características
- **Generación automática** de 5 endpoints por modelo (GET, POST, PUT, DELETE)
- **Descubrimiento automático** de modelos en `api/models/`
- **75 endpoints REST** generados para 15 modelos
- **Autenticación Bearer Token** para operaciones de escritura
- **Documentación automática** con Swagger UI
- **Manejo de errores** integrado

### 📋 Endpoints generados automáticamente
Para cada modelo se crean:
- `GET /{modelo}/` - Listar todos los registros (público)
- `GET /{modelo}/search` - **Búsqueda inteligente con filtros dinámicos** (público)
- `GET /{modelo}/{id}` - Obtener un registro por ID (público)
- `POST /{modelo}/` - Crear un nuevo registro (**requiere Bearer Token**)
- `PUT /{modelo}/{id}` - Actualizar un registro existente (**requiere Bearer Token**)
- `DELETE /{modelo}/{id}` - Eliminar un registro (**requiere Bearer Token**)

### 🔍 Búsqueda Inteligente con `/search`

El endpoint `/search` utiliza **búsqueda inteligente** que se adapta al tipo de campo:

- **Campos de texto** (VARCHAR, TEXT, STRING): Usa `ILIKE %valor%` para búsqueda **parcial** y **case-insensitive**
- **Campos numéricos/fechas** (INTEGER, FLOAT, DATE): Usa **igualdad exacta**

#### 🔍 Ejemplos de Búsqueda Inteligente con `/search`

**Búsqueda parcial en campos de texto:**
```bash
# Buscar municipios que contengan "madrid" (case-insensitive)
curl "http://localhost:8000/municipality/search?name=madrid"

# Buscar hospitales que contengan "central" en el nombre
curl "http://localhost:8000/hospital/search?name_large=central"

# Buscar educación por parte del nombre del municipio
curl "http://localhost:8000/education/search?municipality_name=barcel"
```

**Búsqueda exacta en campos numéricos:**
```bash
# Buscar por ID secundario exacto
curl "http://localhost:8000/municipality/search?id_secondary=1122"

# Buscar por año específico
curl "http://localhost:8000/education_cycle_metrics/search?analysis_year=2023"
```

**Combinando múltiples filtros:**
```bash
# Buscar con múltiples criterios (texto + numérico)
curl "http://localhost:8000/hospital_analysis/search?hospital_name=hospital&analysis_year=2023"

# Con paginación
curl "http://localhost:8000/education/search?name_short=escuela&skip=0&limit=10"
```

**Respuesta de búsqueda:**
```json
{
  "items": [/* resultados encontrados */],
  "total_count": 25,
  "returned_count": 10,
  "skip": 0,
  "limit": 10,
  "applied_filters": {
    "name_short": "escuela"
  },
  "filter_info": "Los campos de texto usan búsqueda parcial (ILIKE %valor%), otros usan igualdad exacta"
}
```

## 🔑 Configuración de API Key

La API Key se configura en el archivo `.env`:
```env
API_KEY=sk-fastapi-auto-crud-2025-secure-api-key-12345
```

### 🔐 Cómo usar la autenticación Bearer Token

**IMPORTANTE**: Para endpoints que requieren autenticación, debes usar el formato Bearer Token:

```bash
# ✅ CORRECTO - Formato Bearer Token requerido
Authorization: Bearer sk-fastapi-auto-crud-2025-secure-api-key-12345

# ❌ INCORRECTO - No funcionará sin "Bearer"
Authorization: sk-fastapi-auto-crud-2025-secure-api-key-12345
```

## Cómo correr el servicio

1. Activa tu entorno virtual:
   ```bash
   source .venv/bin/activate
   ```
   (O usa `venv` si tu entorno se llama así)

2. Instala las dependencias:
   ```bash
   pip install -r requirement.txt
   ```

3. Configura tu API Key en el archivo `.env`:
   ```bash
   API_KEY=tu-api-key-segura-aqui
   ```

4. Ejecuta el servidor FastAPI:
   ```bash
   # Para desarrollo (con auto-reload)
   uvicorn api.main:app --reload
   
   # Para producción con múltiples workers
   uvicorn api.main:app --workers 4 --host 0.0.0.0 --port 8000
   
   # Con Gunicorn + Uvicorn Workers (RECOMENDADO para producción)
   gunicorn api.main:app -c gunicorn.conf.py
   
   # Gunicorn con configuración manual
   gunicorn api.main:app \
     --workers 4 \
     --worker-class uvicorn.workers.UvicornWorker \
     --bind 0.0.0.0:8000 \
     --access-logfile - \
     --error-logfile -
   
   # En background (segundo plano)
   nohup gunicorn api.main:app -c gunicorn.conf.py > server.log 2>&1 &
   ```

### 🚀 Opciones de Escalabilidad

#### **1. Uvicorn con Workers**
```bash
# Múltiples workers con uvicorn
uvicorn api.main:app --workers 4 --host 0.0.0.0 --port 8000
```

#### **2. Gunicorn + Uvicorn (Recomendado para producción)**
```bash
# Usando el archivo de configuración incluido
gunicorn api.main:app -c gunicorn.conf.py

# O manualmente
gunicorn api.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000
```

#### **3. Con Docker + Load Balancer**
```bash
# Escalar con Docker Compose (múltiples contenedores)
docker-compose up --scale api=4

# Con nginx como load balancer
# Ver sección de Docker más abajo
```

### 📊 Configuración de Workers

**Fórmula recomendada para workers:**
```
workers = (2 x CPU cores) + 1
```

**Ejemplo en tu máquina:**
- 4 CPU cores = 9 workers recomendados
- 8 CPU cores = 17 workers recomendados

### 🐳 Escalabilidad con Docker

#### **Dockerfile optimizado para producción:**
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirement.txt .
RUN pip install --no-cache-dir -r requirement.txt

COPY . .

# Usar gunicorn con múltiples workers
CMD ["gunicorn", "api.main:app", "-c", "gunicorn.conf.py"]
```

#### **Docker Compose con múltiples instancias:**
```yaml
version: '3.8'
services:
  api:
    build: .
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - API_KEY=${API_KEY}
    deploy:
      replicas: 4  # 4 instancias de tu API
    
  nginx:
    image: nginx:alpine
    ports:
      - "8000:80"
    depends_on:
      - api
    # nginx.conf para load balancing
```

### ⚖️ Comparación de Opciones

| Opción | Escalabilidad | Complejidad | Recomendado para |
|--------|---------------|-------------|------------------|
| **Uvicorn simple** | ❌ | Muy Baja | Desarrollo |
| **Uvicorn + workers** | ⚡ | Baja | Desarrollo/Testing |
| **Gunicorn + Uvicorn** | ⚡⚡ | Media | Producción simple |
| **Docker + Load Balancer** | ⚡⚡⚡ | Alta | Producción enterprise |
| **Kubernetes** | ⚡⚡⚡⚡ | Muy Alta | Microservicios |

### 🎯 Recomendaciones por Escenario

**Para tu proyecto actual:**
```bash
# Desarrollo
uvicorn api.main:app --reload

# Producción simple (1 servidor)
gunicorn api.main:app -c gunicorn.conf.py

# Producción con alta carga
docker-compose up --scale api=4
```
