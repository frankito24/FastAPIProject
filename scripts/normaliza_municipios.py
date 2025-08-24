import pandas as pd
import os

def normalize_cmun(val):
    val = str(val).strip()
    if val.isdigit():
        return f"28{val.zfill(3)}"
    return val

def normalize_cmun4(val):
    val = str(val).strip()
    if val.isdigit():
        return val.zfill(4)
    return val

INPUT_CSV = "../downloads/municipios/muni2024/muni2024.csv"
OUTPUT_CSV = "../downloads/normalizacion/municipality.csv"
os.makedirs(os.path.dirname(OUTPUT_CSV), exist_ok=True)

def main():
    df = pd.read_csv(INPUT_CSV)
    df["id"] = df["CMUN"].map(normalize_cmun)
    df["id_secondary"] = df["CMUN4"].map(normalize_cmun4)
    df["name"] = df["DESCR"].astype(str)
    df["tag"] = df["ETIQUETA"].astype(str)
    df_out = df[["id", "id_secondary", "name", "tag"]]
    df_out.to_csv(OUTPUT_CSV, index=False)
    print(f"Archivo normalizado guardado en {OUTPUT_CSV}")

if __name__ == "__main__":
    main()

