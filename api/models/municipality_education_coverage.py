from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Integer

Base = declarative_base()

class MunicipalityEducationCoverage(Base):
    __tablename__ = "municipality_education_coverage"

    id = Column(Integer, primary_key=True, autoincrement=True)
    municipality_id = Column(String)
    analysis_year = Column(String)

    # Información básica
    municipality_name = Column(String)
    total_centers = Column(String)

    # Población por rangos de edad
    total_population_0_19 = Column(String)
    population_0_4 = Column(String)
    population_5_9 = Column(String)
    population_10_14 = Column(String)
    population_15_19 = Column(String)

    # Análisis de cobertura general
    total_estimated_need = Column(String)
    total_capacity = Column(String)
    overall_coverage_ratio = Column(String)
    cycles_with_need = Column(String)
    cycles_covered = Column(String)
    coverage_percentage = Column(String)
    is_fully_covered = Column(String)
    total_deficit = Column(String)

    # Análisis de acceso
    cycles_with_access = Column(String)
    access_percentage = Column(String)
    access_classification = Column(String)
    has_basic_education = Column(String)
    has_mandatory_education = Column(String)
    missing_cycles = Column(String)
