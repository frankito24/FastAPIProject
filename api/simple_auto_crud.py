"""
Sistema simple de generación automática de APIs REST
Similar a @RepositoryRestResource de Spring Boot
"""
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.security import HTTPBearer
from fastapi_crudrouter import SQLAlchemyCRUDRouter
from api.database import get_db
from api.auth import verify_api_key
from typing import Type, Dict, Any, Optional, List
import importlib
import os
from sqlalchemy.orm import Session

# Definir esquema de seguridad para Swagger UI
security = HTTPBearer()

class SimpleAutoCRUD:
    def __init__(self, app: FastAPI):
        self.app = app
        self.models_dir = "api/models"
        self.generated_endpoints = []

    def create_simple_endpoints(self, model_class: Type, table_name: str):
        """Crea endpoints REST simples para un modelo"""

        # Crear rutas básicas manualmente (más confiable que fastapi-crudrouter)

        @self.app.get(
            f"/{table_name}/",
            tags=[table_name.replace('_', ' ').title()],
            summary=f"Listar todos los {table_name}",
            description="📖 Endpoint público - No requiere autenticación"
        )
        async def get_all(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
            """Obtener todos los registros - No requiere autenticación"""
            items = db.query(model_class).offset(skip).limit(limit).all()
            return [self.model_to_dict(item) for item in items]

        @self.app.get(
            f"/{table_name}/search",
            tags=[table_name.replace('_', ' ').title()],
            summary=f"Buscar {table_name} con filtros dinámicos",
            description="📖 Endpoint público - Permite filtrar por cualquier campo usando query parameters con búsqueda parcial (ILIKE %valor%)"
        )
        async def search_with_filters(request: Request, db: Session = Depends(get_db)):
            """Buscar registros usando query parameters dinámicos con búsqueda parcial"""
            try:
                # Obtener todos los query parameters de la request
                query_params = dict(request.query_params)

                # Remover parámetros de paginación si existen
                skip = int(query_params.pop('skip', 0))
                limit = int(query_params.pop('limit', 100))

                # Construir la query base
                query = db.query(model_class)

                # Aplicar filtros dinámicos basados en los query parameters
                for field_name, field_value in query_params.items():
                    if hasattr(model_class, field_name):
                        column = getattr(model_class, field_name)

                        # Determinar el tipo de columna para aplicar el filtro apropiado
                        column_type = str(column.type).upper()

                        if 'VARCHAR' in column_type or 'TEXT' in column_type or 'STRING' in column_type:
                            # Para campos de texto: usar ILIKE para búsqueda parcial case-insensitive
                            query = query.filter(column.ilike(f'%{field_value}%'))
                        else:
                            # Para campos no-texto (números, fechas, etc.): usar igualdad exacta
                            query = query.filter(column == field_value)
                    else:
                        raise HTTPException(
                            status_code=400,
                            detail=f"El campo '{field_name}' no existe en el modelo {model_class.__name__}"
                        )

                # Aplicar paginación
                items = query.offset(skip).limit(limit).all()

                # Contar total de resultados para información adicional
                total_count = query.count()

                return {
                    "items": [self.model_to_dict(item) for item in items],
                    "total_count": total_count,
                    "returned_count": len(items),
                    "skip": skip,
                    "limit": limit,
                    "applied_filters": query_params,
                    "filter_info": "Los campos de texto usan búsqueda parcial (ILIKE %valor%), otros usan igualdad exacta"
                }

            except ValueError as e:
                raise HTTPException(status_code=400, detail=f"Error en parámetros: {str(e)}")
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")

        @self.app.get(
            f"/{table_name}/{{item_id}}",
            tags=[table_name.replace('_', ' ').title()],
            summary=f"Obtener {table_name} por ID",
            description="📖 Endpoint público - No requiere autenticación"
        )
        async def get_one(item_id: str, db: Session = Depends(get_db)):
            """Obtener un registro por ID - No requiere autenticación"""
            item = db.query(model_class).filter(
                getattr(model_class, self.get_primary_key(model_class)) == item_id
            ).first()
            if not item:
                raise HTTPException(status_code=404, detail="Item not found")
            return self.model_to_dict(item)

        @self.app.post(
            f"/{table_name}/",
            tags=[table_name.replace('_', ' ').title()],
            summary=f"Crear nuevo {table_name}",
            description="🔒 Endpoint protegido - Requiere Bearer Token en Authorization header",
            dependencies=[Depends(security)]
        )
        async def create_item(
            item_data: dict,
            db: Session = Depends(get_db),
            api_key: str = Depends(verify_api_key)
        ):
            """Crear un nuevo registro - Requiere Bearer Token"""
            try:
                new_item = model_class(**item_data)
                db.add(new_item)
                db.commit()
                db.refresh(new_item)
                return self.model_to_dict(new_item)
            except Exception as e:
                db.rollback()
                raise HTTPException(status_code=400, detail=str(e))

        @self.app.put(
            f"/{table_name}/{{item_id}}",
            tags=[table_name.replace('_', ' ').title()],
            summary=f"Actualizar {table_name}",
            description="🔒 Endpoint protegido - Requiere Bearer Token en Authorization header",
            dependencies=[Depends(security)]
        )
        async def update_item(
            item_id: str,
            item_data: dict,
            db: Session = Depends(get_db),
            api_key: str = Depends(verify_api_key)
        ):
            """Actualizar un registro - Requiere Bearer Token"""
            pk_field = self.get_primary_key(model_class)
            item = db.query(model_class).filter(getattr(model_class, pk_field) == item_id).first()
            if not item:
                raise HTTPException(status_code=404, detail="Item not found")

            try:
                for key, value in item_data.items():
                    if hasattr(item, key):
                        setattr(item, key, value)
                db.commit()
                db.refresh(item)
                return self.model_to_dict(item)
            except Exception as e:
                db.rollback()
                raise HTTPException(status_code=400, detail=str(e))

        @self.app.delete(
            f"/{table_name}/{{item_id}}",
            tags=[table_name.replace('_', ' ').title()],
            summary=f"Eliminar {table_name}",
            description="🔒 Endpoint protegido - Requiere Bearer Token en Authorization header",
            dependencies=[Depends(security)]
        )
        async def delete_item(
            item_id: str,
            db: Session = Depends(get_db),
            api_key: str = Depends(verify_api_key)
        ):
            """Eliminar un registro - Requiere Bearer Token"""
            pk_field = self.get_primary_key(model_class)
            item = db.query(model_class).filter(getattr(model_class, pk_field) == item_id).first()
            if not item:
                raise HTTPException(status_code=404, detail="Item not found")

            try:
                db.delete(item)
                db.commit()
                return {"message": "Item deleted successfully"}
            except Exception as e:
                db.rollback()
                raise HTTPException(status_code=400, detail=str(e))

        # Registrar endpoints generados
        endpoints = [
            f"GET /{table_name}/ - Listar todos (público)",
            f"GET /{table_name}/search - Buscar con filtros dinámicos (público)",
            f"GET /{table_name}/{{id}} - Obtener por ID (público)",
            f"POST /{table_name}/ - Crear nuevo (requiere Bearer Token) 🔒",
            f"PUT /{table_name}/{{id}} - Actualizar (requiere Bearer Token) 🔒",
            f"DELETE /{table_name}/{{id}} - Eliminar (requiere Bearer Token) 🔒"
        ]
        self.generated_endpoints.extend(endpoints)

        return True

    def get_primary_key(self, model_class):
        """Obtiene el nombre del campo primary key"""
        for column in model_class.__table__.columns:
            if column.primary_key:
                return column.name
        return 'id'  # fallback

    def model_to_dict(self, model_instance):
        """Convierte una instancia del modelo a diccionario"""
        result = {}
        for column in model_instance.__table__.columns:
            value = getattr(model_instance, column.name)
            result[column.name] = value
        return result

    def auto_discover_models(self):
        """Descubre automáticamente todos los modelos y genera sus APIs"""
        models_path = os.path.join(os.getcwd(), self.models_dir.replace('/', os.sep))

        if not os.path.exists(models_path):
            print(f"Directorio de modelos no encontrado: {models_path}")
            return

        generated_count = 0

        for filename in os.listdir(models_path):
            if filename.endswith('.py') and filename != '__init__.py':
                module_name = filename[:-3]  # quitar .py

                try:
                    # Importar el módulo
                    module = importlib.import_module(f"api.models.{module_name}")

                    # Buscar clases que sean modelos SQLAlchemy
                    for attr_name in dir(module):
                        attr = getattr(module, attr_name)

                        if (isinstance(attr, type) and
                            hasattr(attr, '__tablename__') and
                            hasattr(attr, '__table__')):

                            table_name = attr.__tablename__
                            print(f"🚀 Generando API REST para: {attr_name} -> /{table_name}")

                            if self.create_simple_endpoints(attr, table_name):
                                generated_count += 1
                                print(f"✅ API generada exitosamente para /{table_name}")

                except Exception as e:
                    print(f"❌ Error procesando {module_name}: {e}")
                    continue

        print(f"\n🎉 Se generaron {generated_count} APIs REST automáticamente")
        print(f"📋 Total de endpoints: {len(self.generated_endpoints)}")

    def get_generated_endpoints(self):
        """Retorna información sobre los endpoints generados"""
        return self.generated_endpoints
