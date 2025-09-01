from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Integer

Base = declarative_base()

class EducationCycleMetrics(Base):
    __tablename__ = "education_cycle_metrics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    education_center_id = Column(String)
    cycle = Column(String)
    analysis_year = Column(String)

    # Transiciones específicas
    infant_transitions = Column(String)
    max_infant_ii_places = Column(String)

    # Datos históricos máximos
    max_enrolled = Column(String)
    max_admitted = Column(String)
    max_total_students = Column(String)
    max_year = Column(String)

    # Datos del año objetivo
    target_year_enrolled = Column(String)
    estimated_places = Column(String)
    applications_submitted = Column(String)
    applications_admitted = Column(String)
    applications_admitted_corrected = Column(String)

    # Indicadores calculados
    occupancy_rate = Column(String)
    demand_ratio = Column(String)
    admission_capacity_ratio = Column(String)
    admission_efficiency = Column(String)
    is_active = Column(String)
