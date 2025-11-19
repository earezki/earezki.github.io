import database
from send_mail import send_welcome

def queue_welcome(subscriptionId: int) -> None:
    """
    Queue a welcome email for the given subscription ID.

    Args:
        subscriptionId (int): The ID of the subscription.
    """
    if not subscriptionId:
        raise ValueError("subscriptionId is required to queue a welcome email.")

    try:
        with database.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO welcome_emails (subscription_id)
                VALUES (?)
                """,
                (subscriptionId,)
            )
            conn.commit()
    except database.sqlite3.IntegrityError as e:
        print(f"[ERROR] Subscription ID {subscriptionId} already queued!")


def process_welcome_emails() -> None:
    """
    Process and send all queued welcome emails.
    This function will be called periodically from a scheduler.
    """
    with database.get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT we.id, s.name, s.email
            FROM welcome_emails we
            JOIN subscriptions s ON we.subscription_id = s.id
            """
        )
        rows = cursor.fetchall()
        
        for row in rows:
            welcome_email_id = row[0]
            name = row[1]
            email = row[2]
            
            try:
                # dequeue
                cursor.execute(
                    """
                    DELETE FROM welcome_emails
                    WHERE id = ?
                    """,
                    (welcome_email_id,)
                )

                send_welcome(name, email)
                
                conn.commit()

                print(f"[INFO] Successfully sent welcome email to {email}.")
            except Exception as e:
                print(f"[ERROR] Failed to send welcome email to {email}: {e}")

if __name__ == "__main__":
    print("[INFO] Processing welcome emails...")
    process_welcome_emails()
    print("[INFO] Done processing welcome emails.")