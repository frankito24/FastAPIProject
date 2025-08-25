import os
import glob
import csv
import re
from collections import defaultdict

INPUT_DIR = '../downloads/educacion_solicitud'
OUTPUT_FILE = '../downloads/normalizacion/education_admition.csv'

os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

header = ['id_education', 'cycle', 'type_solicitude', 'year', 'total']

# Normalization mapping for type_solicitude
NORMALIZE_SOLICITUDE = {
    'Admitidas (presentadas en el centro)': 'Admitidas',
    'Admitidas (presentadas en otro centro)': 'Admitidas',
    'No admitidas (presentadas en el centro)': 'No admitidas',
    'Presentadas en el centro': 'Presentadas',
}

def normalize_type_solicitude(raw):
    return NORMALIZE_SOLICITUDE.get(raw, raw)

def main():
    # Agrupar por (id_education, cycle, type_solicitude_norm, year)
    grouped = defaultdict(int)
    for filepath in glob.glob(os.path.join(INPUT_DIR, '*.csv')):
        filename = os.path.basename(filepath).replace('.csv', '')
        match = re.match(r'(\d+)_(.+)', filename)
        if not match:
            continue
        id_education = match.group(1)
        cycle = match.group(2)
        with open(filepath, encoding='utf-8') as f:
            lines = [line.strip() for line in f if line.strip()]
            if len(lines) < 2:
                continue
            years_line = lines[0]
            years = re.findall(r'\d{4}-\d{4}', years_line)
            if not years:
                years = re.findall(r'\d{4}-\d{4}', lines[1])
            for line in lines[1:]:
                parts = [p.strip() for p in line.split(',')]
                if len(parts) < 2:
                    continue
                type_solicitude_raw = parts[0]
                type_solicitude_norm = normalize_type_solicitude(type_solicitude_raw)
                for i, value in enumerate(parts[1:]):
                    year = years[i] if i < len(years) else ''
                    total = value
                    if total:
                        key = (id_education, cycle, type_solicitude_norm, year)
                        grouped[key] += int(total)
    # Escribir la salida con el tipo normalizado
    with open(OUTPUT_FILE, 'w', encoding='utf-8', newline='') as fout:
        writer = csv.writer(fout, delimiter=';')
        writer.writerow(header)
        for key, total in grouped.items():
            id_education, cycle, type_solicitude_norm, year = key
            writer.writerow([id_education, cycle, type_solicitude_norm, year, total])
    print(f"Archivo normalizado guardado en: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
