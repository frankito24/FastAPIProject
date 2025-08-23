from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String

Base = declarative_base()

class Municipality(Base):
    __tablename__ = "municipality"
    id = Column(String, primary_key=True, autoincrement=False)
    id_secondary = Column(String)
    name = Column(String)
    tag = Column(String)

