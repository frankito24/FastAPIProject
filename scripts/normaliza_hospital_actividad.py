import os
import glob
import csv
import re

INPUT_DIR = "../downloads/hospital_actividad_csvs"
OUTPUT_FILE = "../downloads/normalizacion/hospital_activity.csv"

os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

ACTIVITIES = [
    "Estancia media global",
    "Urgencias totales",
    "Total ingresos",
    "Ingresos urgentes",
    "Ingresos programados"
]

def main():
    result = []
    missing_activities = {}
    for filepath in glob.glob(os.path.join(INPUT_DIR, '*.csv')):
        found_activities = set()
        with open(filepath, encoding='utf-8') as f:
            lines = f.readlines()
            years = []
            for line in lines:
                line = line.strip()
                if line.startswith('Serie;'):
                    parts = line.split(';')
                    years = [p for p in parts if re.match(r'^[0-9]{4}$', p)]
                for activity in ACTIVITIES:
                    if line.startswith(activity):
                        found_activities.add(activity)
                        parts = line.split(';')
                        # Extraer nombre hospital
                        hospital_name = os.path.basename(filepath).replace('.csv','')
                        # Extraer valores
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
                                result.append([hospital_name, year, activity, total])
        # Verificar actividades faltantes
        missing = [a for a in ACTIVITIES if a not in found_activities]
        if missing:
            hospital_name = os.path.basename(filepath).replace('.csv','')
            missing_activities[hospital_name] = missing
    # Guardar CSV
    with open(OUTPUT_FILE, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f, delimiter=';')
        writer.writerow(['hospital_name', 'year', 'type_activity', 'total'])
        for row in result:
            writer.writerow(row)
    print(f"Archivo normalizado guardado en: {OUTPUT_FILE}")
    # Imprimir hospitales con actividades faltantes
    if missing_activities:
        print("Hospitales con actividades faltantes:")
        for hosp, acts in missing_activities.items():
            print(f"{hosp}: {', '.join(acts)}")

if __name__ == "__main__":
    main()
