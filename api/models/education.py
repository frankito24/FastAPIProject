from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String

Base = declarative_base()

class Education(Base):
    __tablename__ = "education"
    id = Column(String, primary_key=True, autoincrement=False)
    clave = Column(String)
    address = Column(String)
    id_municipality = Column(String)
    name_short = Column(String)
    utm_x = Column(String)
    utm_y = Column(String)
    name_large = Column(String)
    description_short = Column(String)
    description_large = Column(String)
    tag = Column(String)
    url = Column(String)
    municipality_name = Column(String)
    id_vial = Column(String)
    latitude = Column(String)
    longitude = Column(String)

