# 📊 Análisis Educativo Municipal - Fórmulas y Interpretación

## 🎯 Objetivo
Validar si los centros educativos asignados a cada municipio pueden cubrir las necesidades demográficas por ciclos educativos.

## 📚 Ciclos Educativos

| Ciclo | Edad | Permanencia | Descripción |
|-------|------|-------------|-------------|
| Infantil I | 0-2 años | 3 años | Educación inicial |
| Infantil II | 3-5 años | 3 años | Preescolar |
| Primaria | 6-11 años | 6 años | Primaria obligatoria |
| ESO | 12-15 años | 4 años | Secundaria obligatoria |

---

## 🧮 Fórmulas Principales

### 1. Capacidad de Centros Educativos

#### Plazas Estimadas por Centro:
```
Plazas = MAX(Matriculados) ÷ Años_Permanencia
```
- Se toma el **máximo histórico** de matriculados
- Se divide por años de permanencia para obtener plazas anuales

#### Corrección para Primaria (Transiciones Automáticas):
```
Admitidos_Corregidos = Admitidos + Transiciones_Infantil_II
```
- Los estudiantes de Infantil II del mismo centro pasan automáticamente a Primaria

### 2. Indicadores de Ocupación por Centro

#### Tasa de Ocupación:
```
Ocupación = Matriculados_Actuales ÷ Max_Histórico_Matriculados
```

#### Ratio de Demanda:
```
Demanda = Solicitudes_Presentadas ÷ Plazas_Estimadas
```

#### Eficiencia de Admisión:
```
Eficiencia = Solicitudes_Admitidas ÷ Solicitudes_Presentadas
```

---

## 🏛️ Análisis Municipal

### 3. Estimación de Necesidades Demográficas

#### Infantil I (0-2 años):
```
Necesidad = (Población_0-4 × 3) ÷ 5
```

#### Infantil II (3-5 años):
```
Necesidad = (Población_0-4 × 2) ÷ 5 + (Población_5-9 × 1) ÷ 5
```

#### Primaria (6-11 años):
```
Necesidad = (Población_5-9 × 4) ÷ 5 + (Población_10-14 × 2) ÷ 5
```

#### ESO (12-15 años):
```
Necesidad = (Población_10-14 × 3) ÷ 5 + (Población_15-19 × 1) ÷ 5
```

### 4. Indicadores de Cobertura Municipal

#### Ratio de Cobertura por Ciclo:
```
Cobertura = Capacidad_Municipal ÷ Necesidad_Estimada
```

#### Porcentaje de Cobertura Municipal:
```
%_Cobertura = (Ciclos_Cubiertos ÷ Ciclos_con_Necesidad) × 100
```

#### Déficit Educativo:
```
Déficit = MAX(0, Necesidad_Estimada - Capacidad_Disponible)
```

---

## 📈 Interpretación de Resultados

### Clasificación de Centros

| Ratio Admisión/Capacidad | Clasificación | Interpretación |
|---------------------------|---------------|----------------|
| ≥ 1.0 | **Sobrecapacidad** | Admiten más que su capacidad estimada |
| 0.8 - 0.99 | **Alta Eficiencia** | Uso óptimo de capacidad |
| 0.5 - 0.79 | **Eficiencia Media** | Pueden mejorar utilización |
| < 0.5 | **Baja Eficiencia** | Subutilizan capacidad |

### Clasificación Municipal

| % Cobertura | Nivel | Acción Recomendada |
|-------------|-------|--------------------|
| 100% | 🟢 **Excelente** | Mantener y optimizar |
| 75-99% | 🟡 **Buena** | Reforzar ciclos deficitarios |
| 50-74% | 🟠 **Regular** | Plan de expansión educativa |
| < 50% | 🔴 **Deficiente** | Intervención prioritaria |

### Indicadores de Demanda

| Ratio Demanda | Estado | Descripción |
|---------------|--------|-------------|
| > 1.5 | **Sobredemandado** | Más solicitudes que capacidad |
| 0.8 - 1.5 | **Equilibrado** | Demanda balanceada |
| < 0.8 | **Baja Demanda** | Capacidad excedente |

---

## 🎯 Casos de Uso

### Para Administraciones:
- **Planificación**: Identificar dónde construir centros
- **Presupuesto**: Priorizar inversiones por déficit
- **Políticas**: Evaluar impacto de expansión educativa

### Para Centros Educativos:
- **Capacidad**: Optimizar uso de instalaciones
- **Demanda**: Entender patrones de solicitudes
- **Recursos**: Planificar personal según ocupación

### Para Familias:
- **Residencia**: Considerar disponibilidad educativa
- **Planificación**: Anticipar necesidades futuras

---

## ⚠️ Limitaciones

1. **Movilidad**: No considera estudiantes entre municipios
2. **Preferencias**: Asume distribución uniforme de elección
3. **Socioeconómico**: No incluye factores de accesibilidad
4. **Temporal**: Basado en patrones históricos

---

## 📊 Ejemplo de Cálculo

**Centro con 180 estudiantes de primaria (máximo histórico):**
```
Plazas = 180 ÷ 6 años = 30 plazas anuales
```

**Municipio con 500 niños de 0-4 años:**
```
Necesidad Infantil I = (500 × 3) ÷ 5 = 300 estudiantes
Necesidad Infantil II = (500 × 2) ÷ 5 = 200 estudiantes
```

**Si el municipio tiene capacidad total de 250 plazas Infantil I:**
```
Ratio Cobertura = 250 ÷ 300 = 0.83 → Cubierto (≥ 0.8)
```

---

*📅 Última actualización: Agosto 2025*
*📍 Región: Comunidad de Madrid*
