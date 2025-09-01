from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Integer

Base = declarative_base()

class EducationCenterAnalysis(Base):
    __tablename__ = "education_center_analysis"

    id = Column(Integer, primary_key=True, autoincrement=True)
    education_center_id = Column(String)
    analysis_year = Column(String)

    # Información consolidada del centro
    center_name = Column(String)
    center_type = Column(String)
    cycles_active = Column(String)

    # Totales consolidados
    total_estimated_places = Column(String)
    total_enrolled = Column(String)
    total_max_enrolled = Column(String)
    total_applications_submitted = Column(String)
    total_applications_admitted = Column(String)
    total_applications_admitted_real = Column(String)

    # Indicadores generales del centro
    center_occupancy_rate = Column(String)
    center_demand_ratio = Column(String)
    center_admission_capacity_ratio = Column(String)
    center_admission_efficiency = Column(String)
