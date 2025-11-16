import database
import re

# create subscriptions table if it doesn't exist
with database.get_connection() as conn:
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS subscriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT NOT NULL UNIQUE,
            subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            unsubscribed_at TIMESTAMP NULL
        )
        """
    )
    conn.commit()

def subscribe(name: str, email: str) -> dict:
    """
    Subscribe a user to the newsletter.

    Args:
        name (str): The name of the user.
        email (str): The email address of the user.
    Returns:
        bool: True if subscription was successful, False if email already exists.
    """
    if not email:
        return {
            "success": False,
            "error": "Email is required."
        }

    # validate email format
    regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(regex, email):
        return {
            "success": False,
            "error": "Invalid email format."
        }

    with database.get_connection() as conn:
        cursor = conn.cursor()
        
        # check if unsubscribed before
        cursor.execute(
            """
            SELECT id, unsubscribed_at FROM subscriptions
            WHERE email = ?
            """,
            (email,)
        )
        row = cursor.fetchone()
        # row[1] is unsubscribed_at
        if row and row[1] is not None:
            # re-subscribe by clearing unsubscribed_at
            cursor.execute(
                """
                UPDATE subscriptions
                SET name = ?, unsubscribed_at = NULL, subscribed_at = CURRENT_TIMESTAMP
                WHERE id = ?
                """,
                (name, row[0])
            )
            conn.commit()
            return {
                "success": True
            }
        elif row:
            # already subscribed
            return {
                "success": False,
                "error": "Email already subscribed."
            }

        cursor.execute(
            """
            INSERT INTO subscriptions (name, email, subscribed_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
            """,
            (name, email)
        )
        conn.commit()
        
        return {
            "success": True
        }

        
def unsubscribe(email: str) -> bool:
    """
    Unsubscribe a user from the newsletter.

    Args:
        email (str): The email address of the user.
    Returns:
        bool: True if unsubscription was successful, False if email not found.
    """
    with database.get_connection() as conn:
        cursor = conn.cursor()
        
        cursor.execute(
            """
            UPDATE subscriptions
            SET unsubscribed_at = CURRENT_TIMESTAMP
            WHERE email = ? AND unsubscribed_at IS NULL
            """,
            (email,)
        )
        conn.commit()
        
        return cursor.rowcount > 0
    
def get_active_subscriptions(page: int, page_size: int = 100) -> list[dict]:
    """
    Get a list of active subscriptions.

    Args:
        page (int): The page number for pagination.
        page_size (int): The number of records per page.
    Returns:
        list[dict]: A list of active subscriptions.
    """
    offset = (page - 1) * page_size
    with database.get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT id, name, email, subscribed_at
            FROM subscriptions
            WHERE unsubscribed_at IS NULL
            ORDER BY subscribed_at DESC
            LIMIT ? OFFSET ?
            """,
            (page_size, offset)
        )
        rows = cursor.fetchall()
        
        subscriptions = [
            {
                "id": row[0],
                "name": row[1],
                "email": row[2],
                "subscribed_at": row[3],
            } for row in rows
        ]
        
        return subscriptions