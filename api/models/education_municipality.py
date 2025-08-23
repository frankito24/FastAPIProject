from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Integer

Base = declarative_base()

class EducationMunicipality(Base):
    __tablename__ = "education_municipality"
    id = Column(Integer, primary_key=True, autoincrement=True)
    id_municipality = Column(String)
    id_education = Column(String)
    id_municipality_original = Column(String)
