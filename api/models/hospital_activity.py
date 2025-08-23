from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Integer

Base = declarative_base()

class HospitalActivity(Base):
    __tablename__ = "hospital_activity"
    id = Column(Integer, primary_key=True, autoincrement=True)
    hospital_id = Column(String)
    year = Column(String)
    type_activity = Column(String)
    total = Column(String)
