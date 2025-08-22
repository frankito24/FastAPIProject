import pandas as pd
import os
from pyproj import Transformer

def normalize_cmun(val):
    val = str(val).strip()
    if val.isdigit():
        return f"28{val.zfill(3)}"
    return val

INPUT_CSV = "../downloads/hospitales/hospital/hospital.csv"
OUTPUT_CSV = "../downloads/normalizacion/hospital.csv"
os.makedirs(os.path.dirname(OUTPUT_CSV), exist_ok=True)

# UTM to lat/lon transformer for Madrid (zone 30T, EPSG:25830 to EPSG:4326)
transformer = Transformer.from_crs("EPSG:25830", "EPSG:4326", always_xy=True)

def utm_to_latlon(x, y):
    try:
        lon, lat = transformer.transform(float(x), float(y))
        return lat, lon
    except Exception:
        return None, None

def main():
    df = pd.read_csv(INPUT_CSV)
    result = []
    for _, row in df.iterrows():
        lat, lon = utm_to_latlon(row["UTM_X"], row["UTM_Y"])
        result.append({
            "id": row["CODIGO"],
            "name_large": row["BUSCA"],
            "name": row["DESCR"],
            "id_municipality": normalize_cmun(row["CMUN"]),
            "utm_x": row["UTM_X"],
            "utm_y": row["UTM_Y"],
            "tag": row["ETIQUETA"],
            "address": row["DIRECCION"],
            "url": row["URL"],
            "id_via": row["CD_VIA"],
            "name_municipality": row["MUNICIPIO"],
            "latitude": lat,
            "longitude": lon
        })
    pd.DataFrame(result).to_csv(OUTPUT_CSV, index=False)
    print(f"Archivo generado: {OUTPUT_CSV}")

if __name__ == "__main__":
    main()

