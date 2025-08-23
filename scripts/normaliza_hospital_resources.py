import os
import glob
import csv
import re

INPUT_DIR = "../downloads/hospital_recursos_asignados_csvs"
OUTPUT_FILE = "../downloads/normalizacion/hospital_resources.csv"

# Crear carpeta de salida si no existe
os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

def main():
    result = []
    for filepath in glob.glob(os.path.join(INPUT_DIR, '*.csv')):
        with open(filepath, encoding='utf-8') as f:
            lines = f.readlines()
            years = []
            for line in lines:
                line = line.strip()
                if line.startswith('Serie;'):
                    # Extraer años
                    parts = line.split(';')
                    years = [p for p in parts if re.match(r'^[0-9]{4}$', p)]
                if line.startswith('Camas instaladas'):
                    parts = line.split(';')
                    hospital_name = os.path.basename(filepath).replace('.csv','')
                    # Valores
                    values = []
                    for p in parts:
                        # Quitar separadores de miles (puntos)
                        p = p.replace('.', '')
                        # Reemplazar la coma decimal por punto
                        p = p.replace(',00','').replace(',','.')
                        # Convertir a float si corresponde
                        if re.match(r'^-?[0-9]+([\.][0-9]+)?$', p):
                            try:
                                values.append(float(p))
                            except:
                                pass
                    for i, year in enumerate(years):
                        if i < len(values):
                            total = values[i]
                            result.append([hospital_name, year, 'Camas instaladas', total])
    # Guardar CSV
    with open(OUTPUT_FILE, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f, delimiter=';')
        writer.writerow(['hospital_name', 'year', 'type_resources', 'total'])
        for row in result:
            writer.writerow(row)
    print(f"Archivo normalizado guardado en: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
