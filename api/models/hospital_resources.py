from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Integer

Base = declarative_base()

class HospitalResources(Base):
    __tablename__ = "hospital_resources"
    id = Column(Integer, primary_key=True, autoincrement=True)
    hospital_name = Column(String)
    year = Column(String)
    type_resources = Column(String)
    total = Column(String)
