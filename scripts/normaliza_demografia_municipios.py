import os
import csv
import re
import glob

INPUT_DIR = "../downloads/poblacion_censada_csvs"
OUTPUT_CSV = "../downloads/normalizacion/municipality_demographics.csv"
os.makedirs(os.path.dirname(OUTPUT_CSV), exist_ok=True)

# Helper to convert filename to range
# e.g. 0_4.csv -> 0-4

def filename_to_range(filename):
    base = os.path.splitext(os.path.basename(filename))[0]
    return base.replace('_', '-')

def clean_total(val):
    # Convierte '1.039,00' a 1039
    val = val.replace('.', '')
    if ',' in val:
        val = val.split(',')[0]
    try:
        return int(val)
    except ValueError:
        return None

def main():
    rows = []
    for filepath in glob.glob(os.path.join(INPUT_DIR, '*.csv')):
        range_val = filename_to_range(filepath)
        with open(filepath, encoding='utf-8') as f:
            reader = csv.reader(f, delimiter=';')
            lines = list(reader)
            # Find header with years (e.g. Serie;;;2021;2022;2023;2024)
            year_row = None
            for i, line in enumerate(lines):
                if line and re.match(r'Serie', line[0]):
                    year_row = line
                    break
            if not year_row:
                continue
            years = [y for y in year_row if re.match(r'\d{4}', y)]
            # Find all municipality rows
            for line in lines:
                if line and line[0].startswith('Municipios'):
                    id_secondary = line[1].strip()
                    name = line[2].strip()
                    for idx, year in enumerate(years):
                        # The value for each year is at idx+3 (since first columns are: Municipios;id;name;val1;val2;...)
                        try:
                            total_raw = line[idx+3].strip()
                            total = clean_total(total_raw)
                        except IndexError:
                            total = None
                        rows.append({
                            'id_secondary_municipality': id_secondary,
                            'name': name,
                            'total': total,
                            'year': year,
                            'range': range_val
                        })
    with open(OUTPUT_CSV, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['id_secondary_municipality', 'name', 'total', 'year', 'range'])
        writer.writeheader()
        writer.writerows(rows)
    print(f"Archivo generado: {OUTPUT_CSV}")

if __name__ == "__main__":
    main()
