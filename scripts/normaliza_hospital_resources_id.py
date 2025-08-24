import csv
import os

RESOURCES_PATH = os.path.join(os.path.dirname(__file__), '../downloads/hospital_relation/hospital_resources.csv')
WITH_ID_PATH = os.path.join(os.path.dirname(__file__), '../downloads/hospital_relation/hospital_with_id.csv')
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), '../downloads/normalizacion/hospital_resources.csv')

def build_hospital_id_map():
    hospital_id_map = {}
    with open(WITH_ID_PATH, encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            name_internal = row.get('name_internal')
            hospital_id = row.get('hospital_id')
            if name_internal and hospital_id:
                hospital_id_map[name_internal] = hospital_id
    return hospital_id_map

def normalize_resources():
    hospital_id_map = build_hospital_id_map()
    with open(RESOURCES_PATH, encoding='utf-8') as fin, open(OUTPUT_PATH, 'w', encoding='utf-8', newline='') as fout:
        reader = csv.DictReader(fin, delimiter=';')
        fieldnames = ['hospital_id' if f == 'hospital_name' else f for f in reader.fieldnames]
        writer = csv.DictWriter(fout, fieldnames=fieldnames, delimiter=';')
        writer.writeheader()
        for row in reader:
            orig_name = row['hospital_name']
            hospital_id = hospital_id_map.get(orig_name)
            out_row = {fn: row['hospital_name'] if fn == 'hospital_id' else row.get(fn, '') for fn in fieldnames}
            if hospital_id:
                out_row['hospital_id'] = hospital_id
            else:
                print(f"WARNING: No hospital_id found for hospital_name '{orig_name}'")
            writer.writerow(out_row)

if __name__ == "__main__":
    normalize_resources()

