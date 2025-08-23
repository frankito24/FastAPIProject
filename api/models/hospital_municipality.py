from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Integer

Base = declarative_base()

class HospitalMunicipality(Base):
    __tablename__ = "hospital_municipality"
    id = Column(Integer, primary_key=True, autoincrement=True)
    hospital_name = Column(String)
    municipality_name = Column(String)
