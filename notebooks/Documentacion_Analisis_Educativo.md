# 📊 Análisis Educativo Municipal - Fórmulas y Interpretación

## 🎯 Objetivo
Validar si los centros educativos asignados a cada municipio pueden cubrir las necesidades demográficas por ciclos educativos y evaluar el acceso a servicios educativos.

## 📚 Ciclos Educativos

| Ciclo | Edad | Permanencia | Descripción |
|-------|------|-------------|-------------|
| Infantil I | 0-2 años | 3 años | Educación inicial |
| Infantil II | 3-5 años | 3 años | Preescolar |
| Primaria | 6-11 años | 6 años | Primaria obligatoria |
| ESO | 12-15 años | 4 años | Secundaria obligatoria |

---

## 🧮 Fórmulas de Capacidad de Centros

### 1. Plazas Estimadas por Centro:
```
Plazas_Estimadas = MAX(Matriculados_Históricos) ÷ Años_Permanencia
```
- **Matriculados_Históricos**: Se toma el año con mayor matrícula registrada
- **Años_Permanencia**: Duración típica del ciclo educativo

### 2. Transiciones Automáticas (Infantil II → Primaria):
```
Transiciones_Automáticas = Plazas_Infantil_II_del_Año_Objetivo
Admitidos_Corregidos = Admitidos_Solicitudes + Transiciones_Automáticas
```
- **Corrección específica**: Usa datos del año objetivo (2022-2023), no el máximo histórico
- Solo aplica para centros que ofrecen tanto Infantil II como Primaria

---

## 📊 Indicadores de Ocupación por Centro

### 3. Tasa de Ocupación:
```
Tasa_Ocupación = Matriculados_Año_Objetivo ÷ MAX_Matriculados_Históricos
```

### 4. Ratio de Demanda:
```
Ratio_Demanda = Solicitudes_Presentadas ÷ Plazas_Estimadas
```

### 5. Ratio Admisión vs Capacidad:
```
Ratio_Admisión = Solicitudes_Admitidas_Corregidas ÷ Plazas_Estimadas
```

### 6. Eficiencia de Admisión:
```
Eficiencia = Solicitudes_Admitidas_Reales ÷ Solicitudes_Presentadas
```
- **Nota**: Excluye transiciones automáticas del cálculo de eficiencia

---

## 🏛️ Análisis Municipal - Estimación de Necesidades

### 7. Capacidad Municipal por Ciclo:
```
Capacidad_Municipal = Σ(MAX_Matriculados_Históricos_por_Centro)
```
- **Cambio importante**: Usa máximo de matrícula real, no plazas estimadas

### 8. Estimación Demográfica por Ciclo:

#### Infantil I (0-2 años):
```
Necesidad_Infantil_I = (Población_0-4 × 3) ÷ 5
```

#### Infantil II (3-5 años):
```
Necesidad_Infantil_II = (Población_0-4 × 2) ÷ 5 + (Población_5-9 × 1) ÷ 5
```

#### Primaria (6-11 años):
```
Necesidad_Primaria = (Población_5-9 × 4) ÷ 5 + (Población_10-14 × 2) ÷ 5
```

#### ESO (12-15 años):
```
Necesidad_ESO = (Población_10-14 × 3) ÷ 5 + (Población_15-19 × 1) ÷ 5
```

---

## 📈 Indicadores de Cobertura Municipal

### 9. Ratio de Cobertura por Ciclo:
```
Ratio_Cobertura = Capacidad_Municipal_Ciclo ÷ Necesidad_Estimada_Ciclo
```

### 10. Porcentaje de Cobertura Municipal:
```
% Cobertura = (Ciclos_Cubiertos ÷ Ciclos_con_Necesidad) × 100
```
- **Ciclo Cubierto**: Ratio_Cobertura ≥ 0.8 (80% mínimo)

### 11. Déficit Educativo:
```
Déficit = MAX(0, Necesidad_Estimada - Capacidad_Disponible)
```

---

## 🏫 Análisis de Acceso a Ciclos Educativos

### 12. Métricas de Acceso (Independiente de Capacidad):

#### Ciclos con Acceso:
```
Cycles_with_Access = Σ(Ciclos_con_al_menos_1_centro)
```

#### Porcentaje de Acceso:
```
Access_Percentage = (Cycles_with_Access ÷ 4_Ciclos_Totales) × 100
```

#### Clasificación de Acceso:
```
- Acceso Completo: 4/4 ciclos disponibles
- Acceso Bueno: 3/4 ciclos disponibles  
- Acceso Parcial: 2/4 ciclos disponibles
- Acceso Limitado: 1/4 ciclos disponibles
- Sin Acceso: 0/4 ciclos disponibles
```

### 13. Indicadores Específicos:

#### Educación Básica Completa:
```
Has_Basic_Education = (Infantil_II AND Primaria AND ESO) > 0
```

#### Educación Obligatoria:
```
Has_Mandatory_Education = (Primaria AND ESO) > 0
```

---

## 🎯 Interpretación de Resultados

### Clasificación de Centros por Eficiencia

| Ratio Admisión/Capacidad | Clasificación | Interpretación |
|---------------------------|---------------|----------------|
| ≥ 1.0 | **Sobrecapacidad** | Admiten más que su capacidad estimada |
| 0.8 - 0.99 | **Alta Eficiencia** | Uso óptimo de capacidad |
| 0.5 - 0.79 | **Eficiencia Media** | Pueden mejorar utilización |
| < 0.5 | **Baja Eficiencia** | Subutilizan capacidad |

### Clasificación Municipal por Cobertura

| % Cobertura | Nivel | Acción Recomendada |
|-------------|-------|--------------------|
| 100% | 🟢 **Excelente** | Mantener y optimizar |
| 75-99% | 🟡 **Buena** | Reforzar ciclos deficitarios |
| 50-74% | 🟠 **Regular** | Plan de expansión educativa |
| < 50% | 🔴 **Deficiente** | Intervención prioritaria |

### Clasificación Municipal por Acceso

| Ciclos Disponibles | Clasificación | Estado |
|--------------------|---------------|--------|
| 4/4 | **Acceso Completo** | Oferta educativa integral |
| 3/4 | **Acceso Bueno** | Falta un ciclo específico |
| 2/4 | **Acceso Parcial** | Oferta limitada |
| 1/4 | **Acceso Limitado** | Requiere expansión urgente |
| 0/4 | **Sin Acceso** | Sin infraestructura educativa |

### Indicadores de Demanda por Centro

| Ratio Demanda | Estado | Descripción |
|---------------|--------|-------------|
| > 1.5 | **Sobredemandado** | Más solicitudes que capacidad |
| 0.8 - 1.5 | **Equilibrado** | Demanda balanceada |
| < 0.8 | **Baja Demanda** | Capacidad excedente |

---

## 🔄 Diferencias: Acceso vs Cobertura

### Conceptos Complementarios:

| Concepto | **ACCESO** | **COBERTURA** |
|----------|------------|---------------|
| **Qué mide** | Disponibilidad de servicios | Suficiencia para la población |
| **Enfoque** | ¿Existen centros del ciclo? | ¿Capacidad suficiente vs necesidad? |
| **Independencia** | No considera población | Considera población demográfica |
| **Utilidad** | Planificación de nuevos centros | Optimización de capacidades |

### Casos Especiales:
- **Buen Acceso + Mala Cobertura**: Centros saturados (ampliar capacidad)
- **Poco Acceso + Buena Cobertura**: Pocos ciclos pero suficientes (diversificar oferta)

---

## 📋 Casos de Uso Prácticos

### Para Administraciones Públicas:
- **Planificación Estratégica**: Identificar dónde construir nuevos centros
- **Asignación Presupuestaria**: Priorizar inversiones por déficit y acceso
- **Políticas Educativas**: Evaluar impacto de expansión por municipio

### Para Gestores de Centros:
- **Optimización de Capacidad**: Maximizar uso de instalaciones
- **Gestión de Demanda**: Entender patrones de solicitudes
- **Planificación de Recursos**: Dimensionar personal según ocupación

### Para Planificación Familiar:
- **Elección de Residencia**: Considerar disponibilidad educativa
- **Planificación Educativa**: Anticipar necesidades por ciclos

---

## ⚠️ Limitaciones del Modelo

### Supuestos Metodológicos:
1. **Distribución Poblacional**: Asume distribución uniforme de edades dentro de rangos quinquenales
2. **Permanencia Escolar**: Considera que estudiantes completan ciclos en el mismo centro
3. **Transiciones**: Solo modela automáticas Infantil II → Primaria en mismo centro
4. **Capacidad**: Máximo histórico como proxy de capacidad operativa real

### Factores No Incluidos:
1. **Movilidad Intercomunal**: Estudiantes que cruzan límites municipales
2. **Sector Privado**: Solo analiza centros del sistema público
3. **Transporte Escolar**: Acceso a centros de municipios adyacentes
4. **Factores Socioeconómicos**: Barreras de accesibilidad no geográficas
5. **Calidad Educativa**: Solo evalúa cantidad, no calidad del servicio

---

## 📊 Ejemplos de Cálculo

### Ejemplo 1: Centro con Capacidad
**Centro con 180 estudiantes de primaria (máximo histórico):**
```
Plazas_Estimadas = 180 ÷ 6 años = 30 plazas anuales
```

### Ejemplo 2: Estimación Demográfica Municipal
**Municipio con 500 niños de 0-4 años:**
```
Necesidad_Infantil_I = (500 × 3) ÷ 5 = 300 estudiantes
Necesidad_Infantil_II = (500 × 2) ÷ 5 = 200 estudiantes
```

### Ejemplo 3: Cobertura Municipal
**Si el municipio tiene capacidad total de 250 plazas Infantil I:**
```
Ratio_Cobertura = 250 ÷ 300 = 0.83 → Cubierto (≥ 0.8)
```

### Ejemplo 4: Transiciones Automáticas
**Centro con Infantil II que ofrece también Primaria:**
```
Plazas_Infantil_II_2022_2023 = 45 ÷ 3 = 15 plazas anuales
Transiciones_Automáticas = 15 estudiantes
Admitidos_Primaria_Corregidos = 20 + 15 = 35 estudiantes
```

---

## 🎯 Municipios Críticos - Criterios de Identificación

### Criterios de Priorización:
```
Municipio_Crítico = Población_0-19 > 200 AND Cobertura_% < 50%
```

### Matriz de Intervención:

| Población | Cobertura % | Prioridad | Acción Recomendada |
|-----------|-------------|-----------|---------------------|
| > 500 | < 50% | **ALTA** | Construcción urgente de centros |
| 200-500 | < 50% | **MEDIA** | Ampliación/construcción planificada |
| < 200 | < 50% | **BAJA** | Evaluar transporte escolar |
| Cualquiera | 50-74% | **MEDIA** | Reforzar ciclos deficitarios |

---

*📅 Última actualización: Agosto 2025*  
*📍 Región: Comunidad de Madrid*  
*🔄 Año de análisis: 2022-2023*  
*📊 Metodología: Máximo histórico de matrícula vs necesidades demográficas*
