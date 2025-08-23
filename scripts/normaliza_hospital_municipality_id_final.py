import csv
import os

MUNI_ID_PATH = os.path.join(os.path.dirname(__file__), '../downloads/municipality_relation/municipality_with_id.csv')
INPUT_PATH = os.path.join(os.path.dirname(__file__), '../downloads/municipality_relation/hospital_municipality.csv')
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), '../downloads/normalizacion/hospital_municipality.csv')

def build_municipality_id_map():
    muni_id_map = {}
    with open(MUNI_ID_PATH, encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter=',')
        for row in reader:
            name = row.get('municipality_name')
            muni_id = row.get('municipality_id')
            if name and muni_id:
                muni_id_map[name] = muni_id
    return muni_id_map

def normalize_hospital_municipality():
    muni_id_map = build_municipality_id_map()
    with open(INPUT_PATH, encoding='utf-8') as fin, open(OUTPUT_PATH, 'w', encoding='utf-8', newline='') as fout:
        reader = csv.DictReader(fin, delimiter=';')
        fieldnames = ['hospital_id', 'municipality_id']
        writer = csv.DictWriter(fout, fieldnames=fieldnames, delimiter=';')
        writer.writeheader()
        for row in reader:
            orig_name = row['municipality_name']
            muni_id = muni_id_map.get(orig_name)
            if muni_id:
                out_row = {'hospital_id': row['hospital_id'], 'municipality_id': muni_id}
            else:
                print(f"WARNING: No municipality_id found for municipality_name '{orig_name}'")
                out_row = {'hospital_id': row['hospital_id'], 'municipality_id': orig_name}
            writer.writerow(out_row)

if __name__ == "__main__":
    normalize_hospital_municipality()

