import requests

def send_notification(token, title, message):
    url = "https://exp.host/--/api/v2/push/send"

    payload = {
        "to": token,
        "sound": "default",
        "title": title,
        "body": message
    }

    try:
        response = requests.post(url, json=payload)
        data = response.json()

        print("Expo response:", data)

        return data

    except Exception as e:
        print("Error sending notification:", str(e))
        return {"error": str(e)}