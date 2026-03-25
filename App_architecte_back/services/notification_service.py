import requests
from models import Notification, User
from extensions import db

EXPO_URL = "https://exp.host/--/api/v2/push/send"


def send_notification(token, title, message, user_id=None):

    # 🔔 Payload Expo
    payload = {
        "to": token,
        "sound": "default",
        "title": title,
        "body": message,
    }

    try:
        response = requests.post(EXPO_URL, json=payload)

        if response.status_code != 200:
            print("Expo error:", response.text)

    except Exception as e:
        print("Erreur notification:", e)

    # 💾 Save notification in DB
    if user_id:
        notif = Notification(
            user_id=user_id,
            title=title,
            message=message
        )
        db.session.add(notif)
        db.session.commit()


# 🔹 Helper pour récupérer le token utilisateur
def get_user_token(user_id):
    user = User.query.get(user_id)
    return user.push_token if user else None