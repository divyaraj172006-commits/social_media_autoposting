import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add the backend directory directly to the path
backend_path = os.path.join(os.getcwd(), "backend")
sys.path.append(backend_path)

from models import User, LinkedInUser, TwitterUser

db_path = "d:/042/social_linkedin_poster/backend/social.db"
engine = create_engine(f"sqlite:///{db_path}")
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

import json

def debug_db():
    users = db.query(User).all()
    li_users = db.query(LinkedInUser).all()
    tw_users = db.query(TwitterUser).all()
    
    data = {
        "users": [{"id": u.id, "email": u.email} for u in users],
        "linkedin_connected": [{"id": l.id, "user_id": l.user_id, "li_id": l.linkedin_id} for l in li_users],
        "twitter_connected": [{"id": t.id, "user_id": t.user_id, "screen": t.screen_name} for t in tw_users]
    }
    print(json.dumps(data, indent=2))

if __name__ == "__main__":
    debug_db()
