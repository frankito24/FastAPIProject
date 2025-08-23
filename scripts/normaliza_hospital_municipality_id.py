import csv
import os

HOSPITAL_ID_PATH = os.path.join(os.path.dirname(__file__), '../downloads/hospital_relation/hospital_with_id.csv')
INPUT_PATH = os.path.join(os.path.dirname(__file__), '../downloads/hospital_relation/hospital_municipality.csv')
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), '../downloads/municipality_relation/hospital_municipality.csv')

def build_hospital_id_map():
    hospital_id_map = {}
    with open(HOSPITAL_ID_PATH, encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            name_internal = row.get('name_internal')
            hospital_id = row.get('hospital_id')
            if name_internal and hospital_id:
                hospital_id_map[name_internal] = hospital_id
    return hospital_id_map

def normalize_hospital_municipality():
    hospital_id_map = build_hospital_id_map()
    with open(INPUT_PATH, encoding='utf-8') as fin, open(OUTPUT_PATH, 'w', encoding='utf-8', newline='') as fout:
        reader = csv.DictReader(fin, delimiter=';')
        fieldnames = ['hospital_id', 'municipality_name']
        writer = csv.DictWriter(fout, fieldnames=fieldnames, delimiter=';')
        writer.writeheader()
        for row in reader:
            orig_name = row['hospital_name']
            hospital_id = hospital_id_map.get(orig_name)
            if hospital_id:
                out_row = {'hospital_id': hospital_id, 'municipality_name': row['municipality_name']}
            else:
                print(f"WARNING: No hospital_id found for hospital_name '{orig_name}'")
                out_row = {'hospital_id': orig_name, 'municipality_name': row['municipality_name']}
            writer.writerow(out_row)

if __name__ == "__main__":
    normalize_hospital_municipality()


