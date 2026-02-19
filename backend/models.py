from sqlalchemy import Column, Integer, String
from db import Base

class LinkedInUser(Base):
    __tablename__ = "linkedin_users"

    id = Column(Integer, primary_key=True, index=True)
    linkedin_id = Column(String)
    access_token = Column(String)