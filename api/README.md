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
   cd ../ && uvicorn api.main:app --reload
   ```
   
   ```bash
   # Para producción
   uvicorn api.main:app --host 0.0.0.0 --port 8000
   ```
   
   ```bash
   # En background (segundo plano)
   nohup uvicorn api.main:app --host 0.0.0.0 --port 8000 > server.log 2>&1 &
   ```

### 🌐 Acceso a la API
Una vez iniciado el servidor, puedes acceder a:
- **API Principal**: http://localhost:8000/
- **Documentación Swagger**: http://localhost:8000/docs
- **Documentación ReDoc**: http://localhost:8000/redoc
- **Lista de endpoints**: http://localhost:8000/endpoints

### 📝 Ejemplos de uso

#### Endpoints públicos (sin autenticación)
```bash
# Listar todas las escuelas
curl http://localhost:8000/education/

# Obtener una escuela específica
curl http://localhost:8000/education/123

# Listar todos los hospitales
curl http://localhost:8000/hospital/
```

#### Endpoints protegidos (requieren Bearer Token)

**⚠️ IMPORTANTE**: Todos estos comandos requieren el header `Authorization: Bearer {API_KEY}`

```bash
# Crear un nuevo centro educativo
curl -X POST http://localhost:8000/education/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-fastapi-auto-crud-2025-secure-api-key-12345" \
  -d '{"id": "new_school", "name_short": "Nueva Escuela", "address": "Calle Principal 123"}'

# Actualizar un hospital
curl -X PUT http://localhost:8000/hospital/HOSP001 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-fastapi-auto-crud-2025-secure-api-key-12345" \
  -d '{"name": "Hospital Actualizado", "address": "Nueva Dirección"}'

# Eliminar un registro
curl -X DELETE http://localhost:8000/education_cycle_metrics/1 \
  -H "Authorization: Bearer sk-fastapi-auto-crud-2025-secure-api-key-12345"

# Ejemplo completo de DELETE que funcionó
curl -X DELETE 'http://localhost:8000/education_cycle_metrics/1' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer sk-fastapi-auto-crud-2025-secure-api-key-12345'
```

#### Usando Swagger UI
1. Ve a http://localhost:8000/docs
2. Para endpoints protegidos, haz clic en el botón **"Authorize"** 🔒
3. En el campo que aparece, ingresa SOLO la API Key (sin "Bearer"): 
   ```
   sk-fastapi-auto-crud-2025-secure-api-key-12345
   ```
4. Swagger UI automáticamente agregará "Bearer" al enviar las peticiones
5. Ahora puedes probar todos los endpoints protegidos desde la interfaz

## Cómo inicializar y correr migraciones

1. Asegúrate de tener configurada la variable de entorno `DATABASE_URL` en tu archivo `.env`.

2. Para crear las tablas en la base de datos (migración inicial), haz una petición POST a:
   ```
   POST /migrate
   ```
   Puedes usar herramientas como [test_main.http](../test_main.http), Postman o curl:
   ```bash
   curl -X POST http://localhost:8000/migrate
   ```

## 🔧 Arquitectura del Sistema

### Archivos principales
- **`main.py`** - Aplicación FastAPI principal
- **`simple_auto_crud.py`** - Generador automático de APIs REST
- **`auth.py`** - Sistema de autenticación con Bearer Token
- **`database.py`** - Configuración de base de datos
- **`models/`** - Modelos SQLAlchemy (se descubren automáticamente)

### ⚡ Funcionamiento automático
1. Al iniciar la aplicación, `SimpleAutoCRUD` escanea el directorio `api/models/`
2. Detecta automáticamente todas las clases que heredan de modelos SQLAlchemy
3. Genera 5 endpoints REST para cada modelo encontrado
4. Aplica autenticación Bearer Token automáticamente a POST, PUT, DELETE
5. Registra todos los endpoints en la aplicación FastAPI

### 🔒 Sistema de Seguridad
- **Lectura pública**: GET endpoints no requieren autenticación
- **Escritura protegida**: POST, PUT, DELETE requieren Bearer Token válido
- **Autenticación Bearer**: Usa el estándar HTTP Bearer Token (`Authorization: Bearer {token}`)
- **Validación automática**: Verifica la API Key en cada request protegido
- **Formato obligatorio**: Debe incluir "Bearer" antes de la API Key

### 🎯 Modelos soportados automáticamente
- Education (Centros educativos)
- Hospital (Hospitales)
- Municipality (Municipios)
- EducationCycleMetrics (Métricas de ciclos educativos)
- HospitalAnalysis (Análisis hospitalarios)
- MunicipalityDemographics (Demografía municipal)
- Y todos los demás modelos en `api/models/`

## 🔍 Debugging y Logs

### Ver logs del servidor
Si ejecutaste el servidor en background:
```bash
# Ver logs en tiempo real
tail -f server.log

# Ver los últimos logs
tail -n 50 server.log
```

### Verificar que el sistema automático funciona
```bash
# Verificar cuántos endpoints se generaron
curl http://localhost:8000/endpoints

# Probar un endpoint público
curl http://localhost:8000/education/ | jq '.[0:3]'  # Primeros 3 registros

# Probar autenticación (debería fallar sin Bearer Token)
curl -X POST http://localhost:8000/education/ \
  -H "Content-Type: application/json" \
  -d '{"id": "test"}'
```

### Errores comunes de autenticación
```bash
# Error 401: Bearer Token faltante o inválido
{
  "detail": "Invalid API Key"
}

# Error 403: Endpoint requiere autenticación
{
  "detail": "Not authenticated"
}

# Error común: Olvidar "Bearer" en el header
# ❌ INCORRECTO:
Authorization: sk-fastapi-auto-crud-2025-secure-api-key-12345

# ✅ CORRECTO:
Authorization: Bearer sk-fastapi-auto-crud-2025-secure-api-key-12345
```

## 📚 Recursos adicionales

- **Swagger UI**: Documentación interactiva completa en `/docs`
- **ReDoc**: Documentación alternativa en `/redoc`
- **OpenAPI Schema**: Esquema completo en `/openapi.json`

---

### 💡 Añadir nuevos modelos

Para añadir un nuevo modelo al sistema automático:

1. Crea tu modelo SQLAlchemy en `api/models/nuevo_modelo.py`
2. Asegúrate de que tenga `__tablename__` y herede de `Base`
3. Reinicia el servidor - automáticamente se generarán los 5 endpoints REST
4. Los endpoints POST, PUT, DELETE requerirán automáticamente Bearer Token

### 🔐 Cambiar la API Key

1. Modifica el valor en `.env`:
   ```env
   API_KEY=nueva-api-key-super-segura
   ```
2. Reinicia el servidor
3. Actualiza tus clientes para usar la nueva API Key con formato Bearer:
   ```bash
   Authorization: Bearer nueva-api-key-super-segura
   ```

### 🚨 Recordatorio importante sobre autenticación

**SIEMPRE usa el formato Bearer Token:**
- ✅ `Authorization: Bearer {tu-api-key}`
- ❌ `Authorization: {tu-api-key}`

¡El sistema es completamente automático! No necesitas configuración adicional para seguridad o nuevos modelos.
