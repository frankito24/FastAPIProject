from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String

Base = declarative_base()

class Hospital(Base):
    __tablename__ = "hospital"
    id = Column(String, primary_key=True, autoincrement=False)
    name_large = Column(String)
    name = Column(String)
    id_municipality = Column(String)
    utm_x = Column(String)
    utm_y = Column(String)
    tag = Column(String)
    address = Column(String)
    url = Column(String)
    id_via = Column(String)
    name_municipality = Column(String)
    latitude = Column(String)
    longitude = Column(String)
