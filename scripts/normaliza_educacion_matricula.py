import os
import glob
import csv
import re

INPUT_DIR = '../downloads/educacion_matricula'
OUTPUT_FILE = '../downloads/normalizacion/education_enrollment.csv'

os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

header = ['id_education', 'cycle', 'year', 'total']

def normalize_cycle(cycle):
    return cycle.lower().replace(' ', '_')

def main():
    result = []
    for filepath in glob.glob(os.path.join(INPUT_DIR, '*.csv')):
        id_education = os.path.basename(filepath).replace('.csv', '')
        with open(filepath, encoding='utf-8') as f:
            lines = [line.strip() for line in f if line.strip()]
            if len(lines) < 2:
                continue
            # Leer años de la primera línea
            years_line = lines[0]
            years = re.findall(r'\d{4}-\d{4}', years_line)
            if not years:
                years = [y.strip() for y in years_line.split(',')[1:]]
            # Leer datos
            for line in lines[1:]:
                parts = [p.strip() for p in line.split(',')]
                if len(parts) < 2:
                    continue
                cycle = normalize_cycle(parts[0])
                for i, value in enumerate(parts[1:]):
                    year = years[i] if i < len(years) else ''
                    total = value
                    if total:
                        result.append([id_education, cycle, year, total])
    with open(OUTPUT_FILE, 'w', encoding='utf-8', newline='') as fout:
        writer = csv.writer(fout, delimiter=';')
        writer.writerow(header)
        for row in result:
            writer.writerow(row)
    print(f"Archivo normalizado guardado en: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()

