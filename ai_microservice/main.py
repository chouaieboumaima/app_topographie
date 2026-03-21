from flask import Flask, request, jsonify
from processing import process_file
from s3_utils import upload_cleaned_file
import requests

app = Flask(__name__)

BACKEND_CALLBACK_URL = "http://127.0.0.1:5000/api/internal/update-status"

@app.route("/process", methods=["POST"])
def process():

    data = request.get_json()
    project_id = data.get("project_id")
    file_url = data.get("file_url")

    # 1️⃣ Télécharger et nettoyer
    cleaned_file_path = process_file(file_url)

    # 2️⃣ Upload cleaned vers S3
    cleaned_url = upload_cleaned_file(cleaned_file_path, project_id)

    # 3️⃣ Informer backend
    requests.post(BACKEND_CALLBACK_URL, json={
        "project_id": project_id,
        "cleaned_file_url": cleaned_url
    })

    return jsonify({"message": "Traitement terminé"}), 200


if __name__ == "__main__":
    app.run(port=8000)