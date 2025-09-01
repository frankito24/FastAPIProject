from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Integer

Base = declarative_base()

class HospitalAnalysis(Base):
    __tablename__ = "hospital_analysis"

    id = Column(Integer, primary_key=True, autoincrement=True)
    hospital_id = Column(String)
    analysis_year = Column(String)

    # Información básica
    hospital_name = Column(String)

    # Recursos físicos
    camas_instaladas = Column(String)
    estancia_media_global = Column(String)

    # Actividad hospitalaria
    ingresos_programados = Column(String)
    ingresos_urgentes = Column(String)
    total_ingresos = Column(String)
    urgencias_totales = Column(String)

    # Métricas calculadas de actividad
    dias_hospitalizacion = Column(String)
    capacidad_anual_camas = Column(String)
    tasa_ocupacion_camas = Column(String)
    tasa_ingreso_urgencias = Column(String)
    total_ingresos_calculado = Column(String)
    ratio_urgentes_programados = Column(String)
    productividad_camas = Column(String)
    eficiencia_estancia = Column(String)

    # Scores normalizados (0-100)
    tasa_ocupacion_camas_percentile = Column(String)
    tasa_ocupacion_camas_score = Column(String)
    tasa_ingreso_urgencias_percentile = Column(String)
    tasa_ingreso_urgencias_score = Column(String)
    ratio_urgentes_programados_percentile = Column(String)
    ratio_urgentes_programados_score = Column(String)
    productividad_camas_percentile = Column(String)
    productividad_camas_score = Column(String)
    eficiencia_estancia_percentile = Column(String)
    eficiencia_estancia_score = Column(String)
    nivel_servicio_score = Column(String)

    # Análisis poblacional
    camas_por_1000_hab = Column(String)
    ingresos_por_1000_hab = Column(String)
    urgencias_por_1000_hab = Column(String)
    poblacion_total_asignada = Column(String)
    num_municipios_asignados = Column(String)
    camas_por_1000_asignados = Column(String)
    preparacion_camas = Column(String)
    capacidad_atencion_por_1000_asignados = Column(String)
    urgencias_por_1000_asignados = Column(String)

    # Percentiles poblacionales
    camas_por_1000_asignados_percentile = Column(String)
    capacidad_atencion_por_1000_asignados_percentile = Column(String)
    urgencias_por_1000_asignados_percentile = Column(String)
    indice_preparacion_poblacional = Column(String)

    # Municipios servidos
    municipios_servidos = Column(String)
    municipios_id_servidos = Column(String)
