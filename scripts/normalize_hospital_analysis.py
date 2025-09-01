import csv
import os

INPUT_FILE = '../downloads/results/hospital_analysis.csv'
OUTPUT_DIR = '../downloads/normalizacion'

os.makedirs(OUTPUT_DIR, exist_ok=True)

def main():
    # Headers para hospital_analysis.csv (coinciden exactamente con el modelo)
    hospital_header = [
        'hospital_id', 'analysis_year', 'hospital_name', 'camas_instaladas', 'estancia_media_global',
        'ingresos_programados', 'ingresos_urgentes', 'total_ingresos', 'urgencias_totales',
        'dias_hospitalizacion', 'capacidad_anual_camas', 'tasa_ocupacion_camas',
        'tasa_ingreso_urgencias', 'total_ingresos_calculado', 'ratio_urgentes_programados',
        'productividad_camas', 'eficiencia_estancia', 'tasa_ocupacion_camas_percentile',
        'tasa_ocupacion_camas_score', 'tasa_ingreso_urgencias_percentile',
        'tasa_ingreso_urgencias_score', 'ratio_urgentes_programados_percentile',
        'ratio_urgentes_programados_score', 'productividad_camas_percentile',
        'productividad_camas_score', 'eficiencia_estancia_percentile',
        'eficiencia_estancia_score', 'nivel_servicio_score', 'camas_por_1000_hab',
        'ingresos_por_1000_hab', 'urgencias_por_1000_hab', 'poblacion_total_asignada',
        'num_municipios_asignados', 'camas_por_1000_asignados', 'preparacion_camas',
        'capacidad_atencion_por_1000_asignados', 'urgencias_por_1000_asignados',
        'camas_por_1000_asignados_percentile', 'capacidad_atencion_por_1000_asignados_percentile',
        'urgencias_por_1000_asignados_percentile', 'indice_preparacion_poblacional',
        'municipios_servidos', 'municipios_id_servidos'
    ]

    hospital_data = []

    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        for row in reader:
            hospital_data.append([
                row['hospital_id'],
                '2022',
                row['hospital_name'],
                row['camas_instaladas'],
                row['estancia_media_global'],
                row['ingresos_programados'],
                row['ingresos_urgentes'],
                row['total_ingresos'],
                row['urgencias_totales'],
                row['dias_hospitalizacion'],
                row['capacidad_anual_camas'],
                row['tasa_ocupacion_camas'],
                row['tasa_ingreso_urgencias'],
                row['total_ingresos_calculado'],
                row['ratio_urgentes_programados'],
                row['productividad_camas'],
                row['eficiencia_estancia'],
                row['tasa_ocupacion_camas_percentile'],
                row['tasa_ocupacion_camas_score'],
                row['tasa_ingreso_urgencias_percentile'],
                row['tasa_ingreso_urgencias_score'],
                row['ratio_urgentes_programados_percentile'],
                row['ratio_urgentes_programados_score'],
                row['productividad_camas_percentile'],
                row['productividad_camas_score'],
                row['eficiencia_estancia_percentile'],
                row['eficiencia_estancia_score'],
                row['nivel_servicio_score'],
                row['camas_por_1000_hab'],
                row['ingresos_por_1000_hab'],
                row['urgencias_por_1000_hab'],
                row['poblacion_total_asignada'],
                row['num_municipios_asignados'],
                row['camas_por_1000_asignados'],
                row['preparacion_camas'],
                row['capacidad_atencion_por_1000_asignados'],
                row['urgencias_por_1000_asignados'],
                row['camas_por_1000_asignados_percentile'],
                row['capacidad_atencion_por_1000_asignados_percentile'],
                row['urgencias_por_1000_asignados_percentile'],
                row['indice_preparacion_poblacional'],
                row['municipios_servidos'],
                row['municipios_id_servidos']
            ])

    # Escribir hospital_analysis.csv
    with open(f'{OUTPUT_DIR}/hospital_analysis.csv', 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f, delimiter=';')
        writer.writerow(hospital_header)
        writer.writerows(hospital_data)

    print(f"Archivo creado:")
    print(f"- {OUTPUT_DIR}/hospital_analysis.csv ({len(hospital_data)} registros)")

if __name__ == "__main__":
    main()
