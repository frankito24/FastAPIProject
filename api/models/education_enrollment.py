from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Integer

Base = declarative_base()

class EducationEnrollment(Base):
    __tablename__ = "education_enrollment"
    id = Column(Integer, primary_key=True, autoincrement=True)
    id_education = Column(String)
    cycle = Column(String)
    year = Column(String)
    total = Column(String)
