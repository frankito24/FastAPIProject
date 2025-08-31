# 📊 Documentación de DataFrames - Análisis Educativo

## 🎯 Objetivo
Documentación completa de las columnas de los DataFrames resultantes del análisis educativo municipal que evalúa capacidad vs necesidades demográficas y acceso a servicios educativos.

---

## 📋 DataFrame: `centers_df` - Análisis por Centro Educativo (75 columnas)

| column_name | description |
|-------------|-------------|
| id_education | Identificador único del centro educativo |
| center_name | Nombre corto del centro educativo |
| center_type | Tipo/descripción del centro educativo |
| infantil_i_ciclo_transiciones_infantil | Transiciones automáticas desde Infantil II (siempre 0 para Infantil I) |
| infantil_i_ciclo_max_matriculados | Máximo histórico de estudiantes matriculados en Infantil I |
| infantil_i_ciclo_max_admitidos | Máximo histórico de estudiantes admitidos en Infantil I |
| infantil_i_ciclo_max_total_estudiantes | Máximo histórico total de estudiantes en Infantil I |
| infantil_i_ciclo_año_max | Año en que se registró el máximo en Infantil I |
| infantil_i_ciclo_matriculados_objetivo | Estudiantes matriculados en Infantil I para el año objetivo (2022-2023) |
| infantil_i_ciclo_plazas_estimadas | Plazas anuales estimadas para Infantil I (max_matriculados ÷ 3 años) |
| infantil_i_ciclo_solicitudes_presentadas | Solicitudes presentadas en Infantil I para el año objetivo |
| infantil_i_ciclo_solicitudes_admitidas | Solicitudes admitidas en Infantil I para el año objetivo |
| infantil_i_ciclo_solicitudes_admitidas_corregidas | Solicitudes admitidas corregidas (incluye transiciones automáticas si aplica) |
| infantil_i_ciclo_tasa_ocupacion | Tasa de ocupación: matriculados_objetivo ÷ max_matriculados |
| infantil_i_ciclo_ratio_demanda | Ratio de demanda: solicitudes_presentadas ÷ plazas_estimadas |
| infantil_i_ciclo_ratio_admision_capacidad | Ratio admisión vs capacidad: solicitudes_admitidas_corregidas ÷ plazas_estimadas |
| infantil_i_ciclo_eficiencia_admision | Eficiencia de admisión: solicitudes_admitidas ÷ solicitudes_presentadas |
| infantil_i_ciclo_activo | Indicador si el centro ofrece Infantil I (1=Sí, 0=No) |
| infantil_ii_ciclo_transiciones_infantil | Transiciones automáticas desde Infantil II (siempre 0 para Infantil II) |
| infantil_ii_ciclo_max_matriculados | Máximo histórico de estudiantes matriculados en Infantil II |
| infantil_ii_ciclo_max_admitidos | Máximo histórico de estudiantes admitidos en Infantil II |
| infantil_ii_ciclo_max_total_estudiantes | Máximo histórico total de estudiantes en Infantil II |
| infantil_ii_ciclo_año_max | Año en que se registró el máximo en Infantil II |
| infantil_ii_ciclo_matriculados_objetivo | Estudiantes matriculados en Infantil II para el año objetivo (2022-2023) |
| infantil_ii_ciclo_plazas_estimadas | Plazas anuales estimadas para Infantil II (max_matriculados ÷ 3 años) |
| infantil_ii_ciclo_solicitudes_presentadas | Solicitudes presentadas en Infantil II para el año objetivo |
| infantil_ii_ciclo_solicitudes_admitidas | Solicitudes admitidas en Infantil II para el año objetivo |
| infantil_ii_ciclo_solicitudes_admitidas_corregidas | Solicitudes admitidas corregidas (incluye transiciones automáticas si aplica) |
| infantil_ii_ciclo_tasa_ocupacion | Tasa de ocupación: matriculados_objetivo ÷ max_matriculados |
| infantil_ii_ciclo_ratio_demanda | Ratio de demanda: solicitudes_presentadas ÷ plazas_estimadas |
| infantil_ii_ciclo_ratio_admision_capacidad | Ratio admisión vs capacidad: solicitudes_admitidas_corregidas ÷ plazas_estimadas |
| infantil_ii_ciclo_eficiencia_admision | Eficiencia de admisión: solicitudes_admitidas ÷ solicitudes_presentadas |
| infantil_ii_ciclo_activo | Indicador si el centro ofrece Infantil II (1=Sí, 0=No) |
| primaria_transiciones_infantil | Transiciones automáticas desde Infantil II del año objetivo hacia Primaria |
| primaria_max_plazas_infantil_ii | Máximo histórico de plazas de Infantil II (para cálculo de transiciones) |
| primaria_max_matriculados | Máximo histórico de estudiantes matriculados en Primaria |
| primaria_max_admitidos | Máximo histórico de estudiantes admitidos en Primaria |
| primaria_max_total_estudiantes | Máximo histórico total de estudiantes en Primaria |
| primaria_año_max | Año en que se registró el máximo en Primaria |
| primaria_matriculados_objetivo | Estudiantes matriculados en Primaria para el año objetivo (2022-2023) |
| primaria_plazas_estimadas | Plazas anuales estimadas para Primaria (max_matriculados ÷ 6 años) |
| primaria_solicitudes_presentadas | Solicitudes presentadas en Primaria para el año objetivo |
| primaria_solicitudes_admitidas | Solicitudes admitidas en Primaria para el año objetivo |
| primaria_solicitudes_admitidas_corregidas | Solicitudes admitidas corregidas (incluye transiciones automáticas de Infantil II) |
| primaria_tasa_ocupacion | Tasa de ocupación: matriculados_objetivo ÷ max_matriculados |
| primaria_ratio_demanda | Ratio de demanda: solicitudes_presentadas ÷ plazas_estimadas |
| primaria_ratio_admision_capacidad | Ratio admisión vs capacidad: solicitudes_admitidas_corregidas ÷ plazas_estimadas |
| primaria_eficiencia_admision | Eficiencia de admisión: solicitudes_admitidas ÷ solicitudes_presentadas |
| primaria_activo | Indicador si el centro ofrece Primaria (1=Sí, 0=No) |
| eso_transiciones_infantil | Transiciones automáticas desde Infantil II (siempre 0 para ESO) |
| eso_max_matriculados | Máximo histórico de estudiantes matriculados en ESO |
| eso_max_admitidos | Máximo histórico de estudiantes admitidos en ESO |
| eso_max_total_estudiantes | Máximo histórico total de estudiantes en ESO |
| eso_año_max | Año en que se registró el máximo en ESO |
| eso_matriculados_objetivo | Estudiantes matriculados en ESO para el año objetivo (2022-2023) |
| eso_plazas_estimadas | Plazas anuales estimadas para ESO (max_matriculados ÷ 4 años) |
| eso_solicitudes_presentadas | Solicitudes presentadas en ESO para el año objetivo |
| eso_solicitudes_admitidas | Solicitudes admitidas en ESO para el año objetivo |
| eso_solicitudes_admitidas_corregidas | Solicitudes admitidas corregidas (incluye transiciones automáticas si aplica) |
| eso_tasa_ocupacion | Tasa de ocupación: matriculados_objetivo ÷ max_matriculados |
| eso_ratio_demanda | Ratio de demanda: solicitudes_presentadas ÷ plazas_estimadas |
| eso_ratio_admision_capacidad | Ratio admisión vs capacidad: solicitudes_admitidas_corregidas ÷ plazas_estimadas |
| eso_eficiencia_admision | Eficiencia de admisión: solicitudes_admitidas ÷ solicitudes_presentadas |
| eso_activo | Indicador si el centro ofrece ESO (1=Sí, 0=No) |
| ciclos_activos | Número total de ciclos educativos que ofrece el centro (máximo 4) |
| total_plazas_estimadas | Suma de plazas estimadas de todos los ciclos del centro |
| total_matriculados | Total de estudiantes matriculados en el año objetivo (2022-2023) |
| total_max_matriculados | Total del máximo histórico de matriculados de todos los ciclos |
| total_solicitudes_presentadas | Total de solicitudes presentadas en el año objetivo |
| total_solicitudes_admitidas | Total de solicitudes admitidas corregidas (incluye transiciones) |
| total_solicitudes_admitidas_reales | Total de solicitudes admitidas reales (excluye transiciones automáticas) |
| tasa_ocupacion_centro | Tasa de ocupación general del centro: total_matriculados ÷ total_max_matriculados |
| ratio_demanda_centro | Ratio de demanda general del centro: total_solicitudes_presentadas ÷ total_plazas_estimadas |
| ratio_admision_capacidad_centro | Ratio de admisión vs capacidad general del centro |
| eficiencia_admision_centro | Eficiencia de admisión general del centro (excluye transiciones automáticas) |

---

## 🏛️ DataFrame: `municipal_coverage_df` - Análisis Municipal (66 columnas)

| column_name | description |
|-------------|-------------|
| id_municipality | Identificador único del municipio |
| municipality_name | Nombre del municipio |
| total_centers | Número total de centros educativos activos en el municipio |
| total_population_0_19 | Población total del municipio entre 0-19 años |
| population_0-4 | Población del municipio entre 0-4 años |
| population_5-9 | Población del municipio entre 5-9 años |
| population_10-14 | Población del municipio entre 10-14 años |
| population_15-19 | Población del municipio entre 15-19 años |
| infantil_i_ciclo_capacity | Capacidad municipal para Infantil I (suma máximo matriculados históricos) |
| infantil_i_ciclo_plazas_estimadas | Plazas estimadas municipales para Infantil I |
| infantil_i_ciclo_max_matriculados | Máximo matriculados históricos municipales para Infantil I |
| infantil_i_ciclo_solicitudes | Total solicitudes presentadas municipales para Infantil I |
| infantil_i_ciclo_admitidos | Total admitidos municipales para Infantil I |
| infantil_i_ciclo_num_centers | Número de centros que ofrecen Infantil I en el municipio |
| infantil_i_ciclo_centers_names | Nombres de los centros que ofrecen Infantil I |
| infantil_ii_ciclo_capacity | Capacidad municipal para Infantil II (suma máximo matriculados históricos) |
| infantil_ii_ciclo_plazas_estimadas | Plazas estimadas municipales para Infantil II |
| infantil_ii_ciclo_max_matriculados | Máximo matriculados históricos municipales para Infantil II |
| infantil_ii_ciclo_solicitudes | Total solicitudes presentadas municipales para Infantil II |
| infantil_ii_ciclo_admitidos | Total admitidos municipales para Infantil II |
| infantil_ii_ciclo_num_centers | Número de centros que ofrecen Infantil II en el municipio |
| infantil_ii_ciclo_centers_names | Nombres de los centros que ofrecen Infantil II |
| primaria_capacity | Capacidad municipal para Primaria (suma máximo matriculados históricos) |
| primaria_plazas_estimadas | Plazas estimadas municipales para Primaria |
| primaria_max_matriculados | Máximo matriculados históricos municipales para Primaria |
| primaria_solicitudes | Total solicitudes presentadas municipales para Primaria |
| primaria_admitidos | Total admitidos municipales para Primaria |
| primaria_num_centers | Número de centros que ofrecen Primaria en el municipio |
| primaria_centers_names | Nombres de los centros que ofrecen Primaria |
| eso_capacity | Capacidad municipal para ESO (suma máximo matriculados históricos) |
| eso_plazas_estimadas | Plazas estimadas municipales para ESO |
| eso_max_matriculados | Máximo matriculados históricos municipales para ESO |
| eso_solicitudes | Total solicitudes presentadas municipales para ESO |
| eso_admitidos | Total admitidos municipales para ESO |
| eso_num_centers | Número de centros que ofrecen ESO en el municipio |
| eso_centers_names | Nombres de los centros que ofrecen ESO |
| infantil_i_ciclo_estimated_need | Necesidad estimada de Infantil I: (población_0-4 × 3) ÷ 5 |
| infantil_i_ciclo_coverage_ratio | Ratio de cobertura: capacity ÷ estimated_need |
| infantil_i_ciclo_is_covered | Indicador si el ciclo está cubierto (coverage_ratio ≥ 1.0) |
| infantil_i_ciclo_deficit | Déficit de plazas: max(0, estimated_need - capacity) |
| infantil_ii_ciclo_estimated_need | Necesidad estimada de Infantil II: (población_0-4 × 2) ÷ 5 + (población_5-9 × 1) ÷ 5 |
| infantil_ii_ciclo_coverage_ratio | Ratio de cobertura: capacity ÷ estimated_need |
| infantil_ii_ciclo_is_covered | Indicador si el ciclo está cubierto (coverage_ratio ≥ 1.0) |
| infantil_ii_ciclo_deficit | Déficit de plazas: max(0, estimated_need - capacity) |
| primaria_estimated_need | Necesidad estimada de Primaria: (población_5-9 × 4) ÷ 5 + (población_10-14 × 2) ÷ 5 |
| primaria_coverage_ratio | Ratio de cobertura: capacity ÷ estimated_need |
| primaria_is_covered | Indicador si el ciclo está cubierto (coverage_ratio ≥ 1.0) |
| primaria_deficit | Déficit de plazas: max(0, estimated_need - capacity) |
| eso_estimated_need | Necesidad estimada de ESO: (población_10-14 × 3) ÷ 5 + (población_15-19 × 1) ÷ 5 |
| eso_coverage_ratio | Ratio de cobertura: capacity ÷ estimated_need |
| eso_is_covered | Indicador si el ciclo está cubierto (coverage_ratio ≥ 1.0) |
| eso_deficit | Déficit de plazas: max(0, estimated_need - capacity) |
| total_estimated_need | Suma de necesidades estimadas de todos los ciclos |
| total_capacity | Suma de capacidades de todos los ciclos (basado en máximo matriculados históricos) |
| overall_coverage_ratio | Ratio de cobertura general: total_capacity ÷ total_estimated_need |
| cycles_with_need | Número de ciclos que tienen necesidad demográfica (estimated_need > 0) |
| cycles_covered | Número de ciclos cubiertos (coverage_ratio ≥ 1.0) |
| coverage_percentage | Porcentaje de cobertura: (cycles_covered ÷ cycles_with_need) × 100 |
| is_fully_covered | Indicador si todos los ciclos con necesidad están cubiertos |
| total_deficit | Déficit total de plazas: max(0, total_estimated_need - total_capacity) |
| cycles_with_access | Número de ciclos educativos disponibles físicamente (tienen al menos 1 centro) |
| access_percentage | Porcentaje de acceso: (cycles_with_access ÷ 4) × 100 |
| access_classification | Clasificación de acceso: Acceso Completo/Bueno/Parcial/Limitado/Sin Acceso |
| has_basic_education | Indicador si tiene educación básica completa (Infantil II + Primaria + ESO) |
| has_mandatory_education | Indicador si tiene educación obligatoria (Primaria + ESO) |
| missing_cycles | Lista de ciclos educativos que no están disponibles en el municipio |

---

## 📊 DataFrame Filtrado: `centers_activos`

Este es un subconjunto de `centers_df` que incluye únicamente los centros educativos que tienen al menos un ciclo activo (`ciclos_activos > 0`). Contiene las mismas 75 columnas que `centers_df` pero filtrado por centros con actividad educativa.

---

## 🔧 Notas Técnicas

### Fórmulas Principales:
- **Plazas Estimadas**: `max_matriculados ÷ años_permanencia`
- **Transiciones Automáticas**: Solo de Infantil II → Primaria en el mismo centro (año objetivo 2022-2023)
- **Capacidad Municipal**: Suma de máximo matriculados históricos (no plazas estimadas)
- **Ratio de Cobertura**: `capacity ÷ estimated_need`
- **Umbral de Cobertura**: ratio ≥ 1.0 para considerar ciclo cubierto

### Años de Permanencia por Ciclo:
- **Infantil I**: 3 años (0-2 años)
- **Infantil II**: 3 años (3-5 años)  
- **Primaria**: 6 años (6-11 años)
- **ESO**: 4 años (12-15 años)

### Clasificaciones de Acceso:
- **Acceso Completo**: 4/4 ciclos (100%)
- **Acceso Bueno**: 3/4 ciclos (75%)
- **Acceso Parcial**: 2/4 ciclos (50%)
- **Acceso Limitado**: 1/4 ciclos (25%)
- **Sin Acceso**: 0/4 ciclos (0%)

### Datos de Referencia:
- **Año objetivo**: 2022-2023 para datos actuales
- **Demografía**: Año más reciente disponible en municipality_demographics
- **Máximos históricos**: Todos los años disponibles en los datasets
- **Transiciones**: Solo aplican para centros que ofrecen ambos Infantil II y Primaria

---

*📅 Última actualización: Agosto 2025*  
*📊 Total de columnas documentadas: 141 (75 + 66)*  
*🎯 Análisis basado en máximo histórico de matrícula vs necesidades demográficas*
