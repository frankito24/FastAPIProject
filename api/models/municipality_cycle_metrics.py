from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Integer

Base = declarative_base()

class MunicipalityCycleMetrics(Base):
    __tablename__ = "municipality_cycle_metrics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    municipality_id = Column(String)
    cycle = Column(String)
    analysis_year = Column(String)

    # Capacidad y oferta
    capacity = Column(String)
    estimated_places = Column(String)
    max_enrolled = Column(String)
    applications = Column(String)
    admitted = Column(String)
    num_centers = Column(String)
    centers_names = Column(String)

    # Análisis de necesidad y cobertura
    estimated_need = Column(String)
    coverage_ratio = Column(String)
    is_covered = Column(String)
    deficit = Column(String)
