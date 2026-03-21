
import requests

AI_SERVICE_URL = "http://127.0.0.1:8000/process"

def call_ai_pipeline(project_id, file_url):
    try:
        requests.post(AI_SERVICE_URL, json={
            "project_id": project_id,
            "file_url": file_url
        })
    except Exception as e:
        print("Erreur appel microservice IA:", e)
