from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Integer

Base = declarative_base()

class MunicipalityDemographics(Base):
    __tablename__ = "municipality_demographics"
    id = Column(Integer, primary_key=True, autoincrement=True)
    id_secondary_municipality = Column(String)
    name = Column(String)
    total = Column(String)
    year = Column(String)
    range = Column(String)
