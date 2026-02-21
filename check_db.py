from sqlalchemy import create_engine, inspect
import os

db_path = "d:/042/social_linkedin_poster/backend/social.db"
engine = create_engine(f"sqlite:///{db_path}")

def check_schema():
    inspector = inspect(engine)
    for table in inspector.get_table_names():
        cols = [c["name"] for c in inspector.get_columns(table)]
        print(f"Table: {table}")
        print(f"  Columns: {', '.join(cols)}")

if __name__ == "__main__":
    if os.path.exists(db_path):
        check_schema()
    else:
        print(f"DB not found at {db_path}")
