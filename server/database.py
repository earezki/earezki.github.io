import sqlite3
import os
from dotenv import load_dotenv
load_dotenv()

db_path = os.getenv("DB_PATH")
db_file = os.path.join(db_path, 'api.db')

# Set Write-Ahead Logging (WAL) mode
try:
    with sqlite3.connect(db_file) as conn:
        
        conn.execute('PRAGMA journal_mode=WAL;')
        print(f"Attempted to set WAL mode for {db_file}")

        # verify the setting
        cursor = conn.execute('PRAGMA journal_mode;')
        current_mode = cursor.fetchone()[0]
        
        print(f"[INFO] Current journal mode: {current_mode}")

        if current_mode.lower() == 'wal':
            print("[INFO] Verification successful: Database is in WAL mode.")
        else:
            print("[ERROR] Verification FAILED: Database is not in WAL mode.")

except sqlite3.Error as e:
    print(f"[ERROR] An error occurred: {e}")

def get_connection():
    """
    Get a connection to the SQLite database.
    Returns:
        sqlite3.Connection: The database connection.
    """
    return sqlite3.connect(db_file)