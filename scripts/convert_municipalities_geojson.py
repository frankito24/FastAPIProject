#!/usr/bin/env python3
"""
Script para convertir shapefile de municipios de Madrid a GeoJSON
"""

import geopandas as gpd
import json
from pathlib import Path

def convert_shapefile_to_geojson():
    """Convierte el shapefile de municipios a GeoJSON para el frontend"""

    # Rutas
    shapefile_path = "downloads/municipios/muni2024/muni2024.shp"
    output_path = "POC/madrid_municipalities.geojson"

    try:
        # Cargar shapefile
        print(f"📂 Cargando shapefile: {shapefile_path}")
        gdf = gpd.read_file(shapefile_path)

        # Info básica
        print(f"✅ Cargados {len(gdf)} municipios")
        print(f"🗂️ Columnas: {list(gdf.columns)}")
        print(f"📍 CRS original: {gdf.crs}")

        # Convertir a WGS84 si no está ya
        if gdf.crs != 'EPSG:4326':
            print("🔄 Convirtiendo a WGS84 (EPSG:4326)...")
            gdf = gdf.to_crs('EPSG:4326')
            print(f"✅ Convertido a: {gdf.crs}")

        # Verificar bounds (deben estar en Madrid)
        bounds = gdf.bounds
        print(f"📏 Longitude: {bounds.minx.min():.4f} a {bounds.maxx.max():.4f}")
        print(f"📏 Latitude: {bounds.miny.min():.4f} a {bounds.maxy.max():.4f}")

        # Convertir a GeoJSON
        print("🔄 Convirtiendo a GeoJSON...")
        geojson_data = gdf.to_json()

        # Crear directorio POC si no existe
        Path("POC").mkdir(exist_ok=True)

        # Guardar GeoJSON
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(json.loads(geojson_data), f, ensure_ascii=False, indent=2)

        print(f"✅ GeoJSON guardado: {output_path}")
        print(f"📏 Tamaño: {len(geojson_data)/1024:.1f} KB")

        return output_path

    except Exception as e:
        print(f"❌ Error: {e}")
        return None

if __name__ == "__main__":
    convert_shapefile_to_geojson()
