# API Module README

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

3. Ejecuta el servidor FastAPI:
   ```bash
   uvicorn api.main:app --reload
   ```

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

## Cómo regresar a una versión anterior

Actualmente, las migraciones se realizan con `SQLModel.metadata.create_all(engine)`, que solo crea tablas nuevas y no soporta migraciones reversibles (downgrade). Para migraciones avanzadas (upgrade/downgrade), se recomienda usar [Alembic](https://alembic.sqlalchemy.org/).

### Sugerencia para migraciones reversibles

1. Instala Alembic:
   ```bash
   pip install alembic
   ```
2. Inicializa Alembic en tu proyecto:
   ```bash
   alembic init alembic
   ```
3. Configura Alembic y sigue la documentación para crear y aplicar migraciones.

---

Si necesitas ayuda para integrar Alembic, avísame.

