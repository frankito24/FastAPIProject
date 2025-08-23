import os
import glob
import csv
import re

INPUT_DIR = '../downloads/educacion_solicitud'
OUTPUT_FILE = '../downloads/normalizacion/education_admition.csv'

os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

header = ['id_education', 'cycle', 'type_solicitude', 'year', 'total']

def main():
    result = []
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
                type_solicitude = parts[0]
                for i, value in enumerate(parts[1:]):
                    year = years[i] if i < len(years) else ''
                    total = value
                    if total:
                        result.append([id_education, cycle, type_solicitude, year, total])
    with open(OUTPUT_FILE, 'w', encoding='utf-8', newline='') as fout:
        writer = csv.writer(fout, delimiter=';')
        writer.writerow(header)
        for row in result:
            writer.writerow(row)
    print(f"Archivo normalizado guardado en: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
