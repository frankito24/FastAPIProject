# Documentación del DataFrame: hospital_unique_results

Este documento describe las 42 columnas del DataFrame `hospital_unique_results`, que contiene el análisis completo de hospitales con indicadores de servicio, capacidad y preparación poblacional.

## Estructura de Columnas

| Column Name | Description |
|-------------|-------------|
| hospital_id | Identificador único del hospital |
| camas_instaladas | Número total de camas disponibles en el hospital |
| estancia_media_global | Promedio de días de hospitalización por paciente |
| ingresos_programados | Total de ingresos hospitalarios programados en 2022 |
| ingresos_urgentes | Total de ingresos hospitalarios de urgencia en 2022 |
| total_ingresos | Suma total de ingresos hospitalarios (programados + urgentes) |
| urgencias_totales | Número total de urgencias atendidas en 2022 |
| dias_hospitalizacion | Total de días-paciente de hospitalización (total_ingresos × estancia_media_global) |
| capacidad_anual_camas | Capacidad teórica anual de camas (camas_instaladas × 365 días) |
| tasa_ocupacion_camas | Ratio de ocupación de camas (dias_hospitalizacion / capacidad_anual_camas) |
| tasa_ingreso_urgencias | Eficiencia en urgencias (total_ingresos / urgencias_totales) |
| total_ingresos_calculado | Verificación: suma de ingresos urgentes + programados |
| ratio_urgentes_programados | Proporción de ingresos urgentes vs programados |
| productividad_camas | Ingresos por cama disponible (total_ingresos / camas_instaladas) |
| eficiencia_estancia | Inverso de la estancia media (1 / estancia_media_global) |
| tasa_ocupacion_camas_percentile | Percentil de la tasa de ocupación respecto a otros hospitales |
| tasa_ocupacion_camas_score | Score normalizado de ocupación (penaliza ocupaciones extremas) |
| tasa_ingreso_urgencias_percentile | Percentil de eficiencia en urgencias respecto a otros hospitales |
| tasa_ingreso_urgencias_score | Score normalizado de eficiencia en urgencias |
| ratio_urgentes_programados_percentile | Percentil del ratio urgentes/programados respecto a otros hospitales |
| ratio_urgentes_programados_score | Score normalizado del ratio urgentes/programados |
| productividad_camas_percentile | Percentil de productividad de camas respecto a otros hospitales |
| productividad_camas_score | Score normalizado de productividad de camas |
| eficiencia_estancia_percentile | Percentil de eficiencia de estancia respecto a otros hospitales |
| eficiencia_estancia_score | Score normalizado de eficiencia de estancia |
| nivel_servicio_score | Índice compuesto de nivel de servicio (promedio de scores de indicadores) |
| hospital_name | Nombre descriptivo del hospital |
| camas_por_1000_hab | Camas por cada 1000 habitantes del municipio donde está ubicado |
| ingresos_por_1000_hab | Ingresos hospitalarios por cada 1000 habitantes del municipio |
| urgencias_por_1000_hab | Urgencias por cada 1000 habitantes del municipio |
| poblacion_total_asignada | Suma total de población de todos los municipios asignados al hospital |
| num_municipios_asignados | Número de municipios que atiende el hospital |
| camas_por_1000_asignados | Camas por cada 1000 habitantes de la población total asignada |
| preparacion_camas | Clasificación de preparación: Excelente (≥4), Adecuada (2-4), Básica (1-2), Insuficiente (<1) |
| capacidad_atencion_por_1000_asignados | Ingresos por cada 1000 habitantes de la población total asignada |
| urgencias_por_1000_asignados | Urgencias por cada 1000 habitantes de la población total asignada |
| camas_por_1000_asignados_percentile | Percentil de camas por población asignada respecto a otros hospitales |
| capacidad_atencion_por_1000_asignados_percentile | Percentil de capacidad de atención por población asignada |
| urgencias_por_1000_asignados_percentile | Percentil de urgencias por población asignada respecto a otros hospitales |
| indice_preparacion_poblacional | Índice compuesto de preparación para la población asignada |
| municipios_servidos | Lista de nombres de municipios que atiende el hospital |
| municipios_id_servidos | Lista de IDs de municipios que atiende el hospital |

## Categorías de Indicadores

### 1. Datos Básicos del Hospital
- **hospital_id**: Identificador único
- **hospital_name**: Nombre del hospital
- **camas_instaladas**: Capacidad física

### 2. Actividad Hospitalaria (2022)
- **ingresos_programados/urgentes/total**: Volumen de actividad
- **urgencias_totales**: Atención de emergencias
- **estancia_media_global**: Eficiencia de tratamiento

### 3. Indicadores de Eficiencia Operativa
- **tasa_ocupacion_camas**: Utilización de recursos
- **productividad_camas**: Rendimiento por cama
- **eficiencia_estancia**: Rapidez de tratamiento
- **tasa_ingreso_urgencias**: Conversión urgencias-ingresos

### 4. Scores Normalizados (0-100)
- **nivel_servicio_score**: Índice general de calidad del servicio
- Scores individuales por indicador con percentiles

### 5. Análisis Poblacional
- **poblacion_total_asignada**: Población bajo responsabilidad
- **num_municipios_asignados**: Cobertura territorial
- **municipios_servidos/municipios_id_servidos**: Detalle de cobertura

### 6. Indicadores de Preparación Poblacional
- **camas_por_1000_asignados**: Preparación de infraestructura
- **preparacion_camas**: Clasificación según estándares internacionales
- **indice_preparacion_poblacional**: Preparación general para la población

## Interpretación de Scores

### Nivel de Servicio (0-100)
- **80-100**: Excelente nivel de servicio
- **60-79**: Buen nivel de servicio
- **40-59**: Nivel de servicio aceptable
- **20-39**: Nivel de servicio deficiente
- **0-19**: Nivel de servicio crítico

### Preparación de Camas
- **Excelente**: ≥4 camas por 1000 habitantes
- **Adecuada**: 2-4 camas por 1000 habitantes
- **Básica**: 1-2 camas por 1000 habitantes
- **Insuficiente**: <1 cama por 1000 habitantes

## Uso del DataFrame

Este DataFrame permite análisis comparativos entre hospitales considerando:
1. **Eficiencia operativa**: Comparación de indicadores de gestión
2. **Capacidad poblacional**: Evaluación de preparación para la población asignada
3. **Cobertura territorial**: Análisis de municipios atendidos
4. **Benchmarking**: Posicionamiento relativo mediante percentiles

## Notas Técnicas

- Los datos corresponden al año 2022
- Los percentiles se calculan respecto al conjunto total de hospitales analizados
- Las listas de municipios permiten análisis de cobertura geográfica
- Los índices compuestos facilitan rankings y comparaciones generales
