from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Integer

Base = declarative_base()

class EducationAdmition(Base):
    __tablename__ = "education_admition"
    id = Column(Integer, primary_key=True, autoincrement=True)
    id_education = Column(String)
    cycle = Column(String)
    type_solicitude = Column(String)
    year = Column(String)
    total = Column(String)
