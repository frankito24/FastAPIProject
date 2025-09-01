import csv
import os

INPUT_FILE = '../downloads/results/education_municipality_coverage.csv'
OUTPUT_DIR = '../downloads/normalizacion'

os.makedirs(OUTPUT_DIR, exist_ok=True)

def main():
    # Headers para municipality_education_coverage.csv (coinciden exactamente con el modelo)
    coverage_header = [
        'municipality_id', 'analysis_year', 'municipality_name', 'total_centers',
        'total_population_0_19', 'population_0_4', 'population_5_9', 'population_10_14',
        'population_15_19', 'total_estimated_need', 'total_capacity', 'overall_coverage_ratio',
        'cycles_with_need', 'cycles_covered', 'coverage_percentage', 'is_fully_covered',
        'total_deficit', 'cycles_with_access', 'access_percentage', 'access_classification',
        'has_basic_education', 'has_mandatory_education', 'missing_cycles'
    ]

    # Headers para municipality_cycle_metrics.csv (coinciden exactamente con el modelo)
    cycle_metrics_header = [
        'municipality_id', 'cycle', 'analysis_year', 'capacity', 'estimated_places',
        'max_enrolled', 'applications', 'admitted', 'num_centers', 'centers_names',
        'estimated_need', 'coverage_ratio', 'is_covered', 'deficit'
    ]

    coverage_data = []
    cycle_metrics_data = []

    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        for row in reader:
            # Datos de cobertura municipal
            coverage_data.append([
                row['id_municipality'],
                '2022-2023',
                row['municipality_name'],
                row['total_centers'],
                row['total_population_0_19'],
                row['population_0-4'],
                row['population_5-9'],
                row['population_10-14'],
                row['population_15-19'],
                row['total_estimated_need'],
                row['total_capacity'],
                row['overall_coverage_ratio'],
                row['cycles_with_need'],
                row['cycles_covered'],
                row['coverage_percentage'],
                row['is_fully_covered'],
                row['total_deficit'],
                row['cycles_with_access'],
                row['access_percentage'],
                row['access_classification'],
                row['has_basic_education'],
                row['has_mandatory_education'],
                row['missing_cycles']
            ])

            # Datos por ciclo municipal
            cycles = ['infantil_i_ciclo', 'infantil_ii_ciclo', 'primaria', 'eso']

            for cycle in cycles:
                cycle_metrics_data.append([
                    row['id_municipality'],
                    cycle,
                    '2022-2023',
                    row[f'{cycle}_capacity'],
                    row[f'{cycle}_plazas_estimadas'],
                    row[f'{cycle}_max_matriculados'],
                    row[f'{cycle}_solicitudes'],
                    row[f'{cycle}_admitidos'],
                    row[f'{cycle}_num_centers'],
                    row[f'{cycle}_centers_names'],
                    row[f'{cycle}_estimated_need'],
                    row[f'{cycle}_coverage_ratio'],
                    row[f'{cycle}_is_covered'],
                    row[f'{cycle}_deficit']
                ])

    # Escribir municipality_education_coverage.csv
    with open(f'{OUTPUT_DIR}/municipality_education_coverage.csv', 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f, delimiter=';')
        writer.writerow(coverage_header)
        writer.writerows(coverage_data)

    # Escribir municipality_cycle_metrics.csv
    with open(f'{OUTPUT_DIR}/municipality_cycle_metrics.csv', 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f, delimiter=';')
        writer.writerow(cycle_metrics_header)
        writer.writerows(cycle_metrics_data)

    print(f"Archivos creados:")
    print(f"- {OUTPUT_DIR}/municipality_education_coverage.csv ({len(coverage_data)} registros)")
    print(f"- {OUTPUT_DIR}/municipality_cycle_metrics.csv ({len(cycle_metrics_data)} registros)")

if __name__ == "__main__":
    main()
