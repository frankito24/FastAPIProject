import os
import pandas as pd
import sys
from pathlib import Path

# Obtén la ruta absoluta del proyecto
PROJECT_ROOT = Path(__file__).resolve().parent.parent

# Configuración genérica (rutas relativas por defecto)
INPUT_DBF = os.getenv("INPUT_DBF", str(PROJECT_ROOT / "downloads/otros/secc2024/secc2024.dbf"))
OUTPUT_CSV = os.getenv("OUTPUT_CSV", str(PROJECT_ROOT / "downloads/otros/secc2024/secc2024.csv"))
ENCODING = os.getenv("DBF_ENCODING", "latin-1")

# Si quieres cambiar la ruta, puedes modificar las variables INPUT_DBF y OUTPUT_CSV arriba

def get_encoding_from_cpg(dbf_path: str, default_encoding: str = "latin-1") -> str:
    cpg_path = Path(dbf_path).with_suffix('.cpg')
    if cpg_path.exists():
        try:
            with open(cpg_path, 'r', encoding='ascii') as f:
                encoding = f.read().strip()
                # Normaliza algunos valores comunes
                if encoding.lower() in ["utf-8", "utf8"]:
                    return "utf-8"
                if encoding.lower() in ["latin1", "latin-1"]:
                    return "latin-1"
                if encoding.lower() in ["cp1252"]:
                    return "cp1252"
                return encoding
        except Exception as e:
            print(f"No se pudo leer el archivo .cpg: {e}. Usando encoding por defecto: {default_encoding}")
    return default_encoding

def dbf_to_csv(input_dbf: str, output_csv: str, encoding: str = None):
    try:
        import dbfread
    except ImportError:
        print("Instala dbfread: pip install dbfread")
        sys.exit(1)

    from dbfread import DBF
    tried_encodings = []
    encoding = encoding or get_encoding_from_cpg(input_dbf, ENCODING)
    for enc in [encoding, "latin-1", "cp1252"]:
        if enc in tried_encodings:
            continue
        tried_encodings.append(enc)
        try:
            table = DBF(input_dbf, encoding=enc, char_decode_errors='ignore')
            df = pd.DataFrame(iter(table))
            df.to_csv(output_csv, index=False)
            print(f"Archivo CSV generado en: {output_csv} usando encoding: {enc}")
            return
        except UnicodeDecodeError as e:
            print(f"Error de decodificación con encoding '{enc}': {e}")
    print("No se pudo decodificar el archivo DBF con los encodings probados. Revisa el archivo o especifica el encoding correcto.")
    sys.exit(2)

if __name__ == "__main__":
    dbf_to_csv(INPUT_DBF, OUTPUT_CSV)
