import csv
import os
from pyproj import Proj, transform

INPUT_FILE = '../downloads/educacion/educapu/educapu.csv'
OUTPUT_FILE = '../downloads/normalizacion/education.csv'

os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

# Proyección UTM zona 30N (EPSG: 25830) a WGS84 (EPSG: 4326)
proj_utm = Proj('epsg:25830')
proj_wgs = Proj('epsg:4326')

def utm_to_latlon(x, y):
    try:
        lon, lat = transform(proj_utm, proj_wgs, float(x), float(y))
        return lat, lon
    except Exception:
        return '', ''

def main():
    with open(INPUT_FILE, encoding='utf-8') as fin, open(OUTPUT_FILE, 'w', encoding='utf-8', newline='') as fout:
        reader = csv.DictReader(fin)
        fieldnames = [
            'id', 'clave', 'address', 'id_municipality', 'name_short', 'utm_x', 'utm_y',
            'name_large', 'description_short', 'description_large', 'tag', 'url',
            'municipality_name', 'id_vial', 'latitude', 'longitude'
        ]
        writer = csv.DictWriter(fout, fieldnames=fieldnames, delimiter=';')
        writer.writeheader()
        for row in reader:
            utm_x = row['UTM_X']
            utm_y = row['UTM_Y']
            lat, lon = utm_to_latlon(utm_x, utm_y)
            out_row = {
                'id': row['CODIGO'],
                'clave': row['CLAVE'],
                'address': row['DIRECCION'],
                'id_municipality': f"28{row['CMUN'].zfill(3)}",
                'name_short': row['DESCR'],
                'utm_x': utm_x,
                'utm_y': utm_y,
                'name_large': row['BUSCA'],
                'description_short': row['DS_ABREV'],
                'description_large': row['DS_LARGO'],
                'tag': row['ETIQUETA'],
                'url': row['URL'],
                'municipality_name': row['MUNICIPIO'],
                'id_vial': row['CD_VIAL'],
                'latitude': lat,
                'longitude': lon
            }
            writer.writerow(out_row)
    print(f"Archivo normalizado guardado en: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()

