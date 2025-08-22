import pandas as pd
import requests
import csv
import os

CSV_PATH = "../downloads/municipios/muni2024/muni2024.csv"
CATEGORIAS = ["preinfantil", "infantil", "primaria", "secundaria"]
API_URL = "http://lodcoremadrid-viewers.sel.inf.uc3m.es:5000/educacion/centros/municipios/{cmun}?categoria={categoria}&opcion=publicos"
OUTPUT_CSV = "../downloads/educacion_municipio/relacion.csv"
os.makedirs(os.path.dirname(OUTPUT_CSV), exist_ok=True)

def format_cmun(val):
    val = str(val).strip()
    if val.isdigit():
        return f"28{val.zfill(3)}"
    return val

def main():
    df = pd.read_csv(CSV_PATH)
    cmun_list = df["CMUN"].astype(str).map(format_cmun).tolist()
    rows = []
    for cmun in cmun_list:
        for categoria in CATEGORIAS:
            url = API_URL.format(cmun=cmun, categoria=categoria)
            response = requests.get(url, headers={"accept": "application/json"})
            if response.status_code == 200:
                try:
                    data = response.json().get("data", [])
                    if not data:
                        print(f"Respuesta vacía para URL: {url}")
                    for item in data:
                        lau_id = item.get("lau_id", "")
                        # Trata lau_id como entero si es posible, si no como string
                        try:
                            lau_id = int(lau_id)
                        except (ValueError, TypeError):
                            lau_id = str(lau_id)
                        rows.append({
                            "CMUN": cmun,
                            "centro_id": item.get("centro_id", ""),
                            "lau_id": lau_id
                        })
                except Exception as e:
                    print(f"Error procesando respuesta JSON: {e}")
            else:
                print(f"Error en la consulta: {response.status_code}")
    # Guardar en CSV
    with open(OUTPUT_CSV, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["CMUN", "centro_id", "lau_id"])
        writer.writeheader()
        writer.writerows(rows)
    print(f"Archivo guardado en {OUTPUT_CSV}")

if __name__ == "__main__":
    main()
