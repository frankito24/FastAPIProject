import csv
import os

INPUT_FILE = '../downloads/results/education_analysis.csv'
OUTPUT_DIR = '../downloads/normalizacion'

os.makedirs(OUTPUT_DIR, exist_ok=True)

def main():
    # Headers para education_center_analysis.csv (coinciden exactamente con el modelo)
    center_analysis_header = [
        'education_center_id', 'analysis_year', 'center_name', 'center_type', 'cycles_active',
        'total_estimated_places', 'total_enrolled', 'total_max_enrolled',
        'total_applications_submitted', 'total_applications_admitted',
        'total_applications_admitted_real', 'center_occupancy_rate',
        'center_demand_ratio', 'center_admission_capacity_ratio', 'center_admission_efficiency'
    ]

    # Headers para education_cycle_metrics.csv (coinciden exactamente con el modelo)
    cycle_metrics_header = [
        'education_center_id', 'cycle', 'analysis_year', 'infant_transitions',
        'max_infant_ii_places', 'max_enrolled', 'max_admitted', 'max_total_students',
        'max_year', 'target_year_enrolled', 'estimated_places', 'applications_submitted',
        'applications_admitted', 'applications_admitted_corrected', 'occupancy_rate',
        'demand_ratio', 'admission_capacity_ratio', 'admission_efficiency', 'is_active'
    ]

    center_analysis_data = []
    cycle_metrics_data = []

    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        for row in reader:
            # Datos del centro
            center_analysis_data.append([
                row['id_education'],
                '2022-2023',
                row['center_name'],
                row['center_type'],
                row['ciclos_activos'],
                row['total_plazas_estimadas'],
                row['total_matriculados'],
                row['total_max_matriculados'],
                row['total_solicitudes_presentadas'],
                row['total_solicitudes_admitidas'],
                row['total_solicitudes_admitidas_reales'],
                row['tasa_ocupacion_centro'],
                row['ratio_demanda_centro'],
                row['ratio_admision_capacidad_centro'],
                row['eficiencia_admision_centro']
            ])

            # Datos por ciclo
            cycles = ['infantil_i_ciclo', 'infantil_ii_ciclo', 'primaria', 'eso']

            for cycle in cycles:
                if row[f'{cycle}_activo'] == '1':
                    cycle_metrics_data.append([
                        row['id_education'],
                        cycle,
                        '2022-2023',
                        row.get(f'{cycle}_transiciones_infantil', '0'),
                        row.get(f'{cycle}_max_plazas_infantil_ii', '0'),
                        row[f'{cycle}_max_matriculados'],
                        row[f'{cycle}_max_admitidos'],
                        row[f'{cycle}_max_total_estudiantes'],
                        row[f'{cycle}_año_max'],
                        row[f'{cycle}_matriculados_objetivo'],
                        row[f'{cycle}_plazas_estimadas'],
                        row[f'{cycle}_solicitudes_presentadas'],
                        row[f'{cycle}_solicitudes_admitidas'],
                        row[f'{cycle}_solicitudes_admitidas_corregidas'],
                        row[f'{cycle}_tasa_ocupacion'],
                        row[f'{cycle}_ratio_demanda'],
                        row[f'{cycle}_ratio_admision_capacidad'],
                        row[f'{cycle}_eficiencia_admision'],
                        row[f'{cycle}_activo']
                    ])

    # Escribir education_center_analysis.csv
    with open(f'{OUTPUT_DIR}/education_center_analysis.csv', 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f, delimiter=';')
        writer.writerow(center_analysis_header)
        writer.writerows(center_analysis_data)

    # Escribir education_cycle_metrics.csv
    with open(f'{OUTPUT_DIR}/education_cycle_metrics.csv', 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f, delimiter=';')
        writer.writerow(cycle_metrics_header)
        writer.writerows(cycle_metrics_data)

    print(f"Archivos creados:")
    print(f"- {OUTPUT_DIR}/education_center_analysis.csv ({len(center_analysis_data)} registros)")
    print(f"- {OUTPUT_DIR}/education_cycle_metrics.csv ({len(cycle_metrics_data)} registros)")

if __name__ == "__main__":
    main()
