from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Project, User
from extensions import db
from services.s3_service import upload_file_to_s3
from services.ai_service import call_ai_pipeline
from services.notification import send_notification

file_bp = Blueprint("file_bp", __name__)

# 🔹 Fonction pour récupérer token utilisateur
def get_user_token(user_id):
    user = User.query.get(user_id)
    return user.push_token if user else None


# 🔹 Upload fichier original vers S3
@file_bp.route("/projects/<int:project_id>/upload", methods=["POST"])
@jwt_required()
def upload_file(project_id):

    user_id = get_jwt_identity()
    project = Project.query.get(project_id)

    if not project:
        return jsonify({"error": "Projet non trouvé"}), 404

    if project.user_id != user_id:
        return jsonify({"error": "Accès interdit"}), 403

    if "file" not in request.files:
        return jsonify({"error": "Aucun fichier fourni"}), 400

    file = request.files["file"]

    # 🔹 Upload vers S3
    file_url = upload_file_to_s3(file, project_id)

    project.file_url = file_url
    project.status = "pending"
    db.session.commit()

    # 🔔 Notification : projet chargé
    token = get_user_token(user_id)
    if token:
        send_notification(
            token,
            "Projet chargé",
            "Votre fichier a été uploadé avec succès"
        )

    return jsonify({
        "message": "Fichier uploadé",
        "file_url": file_url
    }), 200


# 🔹 Lancer nettoyage IA
@file_bp.route("/projects/<int:project_id>/clean", methods=["POST"])
@jwt_required()
def clean_file(project_id):

    user_id = get_jwt_identity()
    project = Project.query.get(project_id)

    if not project:
        return jsonify({"error": "Projet non trouvé"}), 404

    if project.user_id != user_id:
        return jsonify({"error": "Accès interdit"}), 403

    if not project.file_url:
        return jsonify({"error": "Aucun fichier à traiter"}), 400

    # 🔹 Change status
    project.status = "processing"
    db.session.commit()

    # 🔹 Appel microservice IA
    call_ai_pipeline(project.id, project.file_url)

    # 🔔 Notification : nettoyage lancé
    token = get_user_token(user_id)
    if token:
        send_notification(
            token,
            "Nettoyage en cours",
            "Le traitement de votre fichier a commencé"
        )

    return jsonify({
        "message": "Pipeline IA lancé",
        "status": "processing"
    }), 200


# 🔹 Télécharger fichier nettoyé
@file_bp.route("/projects/<int:project_id>/download", methods=["GET"])
@jwt_required()
def download_file(project_id):

    user_id = get_jwt_identity()
    project = Project.query.get(project_id)

    if not project:
        return jsonify({"error": "Projet non trouvé"}), 404

    if project.user_id != user_id:
        return jsonify({"error": "Accès interdit"}), 403

    if project.status != "cleaned":
        return jsonify({"error": "Fichier non encore prêt"}), 400

    # 🔔 Notification : projet nettoyé
    token = get_user_token(user_id)
    if token:
        send_notification(
            token,
            "Projet nettoyé",
            "Votre fichier est prêt à être téléchargé"
        )

    return jsonify({
        "cleaned_file_url": project.cleaned_file_url
    }), 200