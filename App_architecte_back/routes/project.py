from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Project, User
#from services.s3_service import upload_file_to_s3
#from services.ai_service import trigger_cleaning_pipeline

project_bp = Blueprint("project_bp", __name__)


# ==============================
# Créer projet
# ==============================

@project_bp.route("/", methods=["POST"])
@jwt_required()
def create_project():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "Utilisateur introuvable"}), 404

    if len(user.projects) >= 5:
        return jsonify({"error": "Limite de projets atteinte. Paiement requis."}), 403

    data = request.get_json()

    project = Project(
        name=data.get("name"),
        description=data.get("description"),
        user_id=user_id,
        status="pending"
    )

    db.session.add(project)
    db.session.commit()

    return jsonify({"message": "Projet créé avec succès"}), 201


# ==============================
# Lister mes projets
# ==============================

@project_bp.route("/", methods=["GET"])
@jwt_required()
def get_my_projects():
    user_id = get_jwt_identity()
    projects = Project.query.filter_by(user_id=user_id).all()

    return jsonify([{
        "id": p.id,
        "name": p.name,
        "status": p.status,
        "created_at": p.created_at.strftime("%Y-%m-%d %H:%M:%S")
    } for p in projects]), 200


# ==============================
# Voir projet
# ==============================

@project_bp.route("/<int:project_id>", methods=["GET"])
@jwt_required()
def get_project(project_id):
    user_id = get_jwt_identity()

    project = Project.query.filter_by(
        id=project_id,
        user_id=user_id
    ).first()

    if not project:
        return jsonify({"error": "Projet non trouvé"}), 404

    return jsonify({
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "status": project.status,
        "file_url": project.file_url,
        "cleaned_file_url": project.cleaned_file_url
    }), 200


# ==============================
# Mettre à jour projet
# ==============================

@project_bp.route("/<int:project_id>", methods=["PUT"])
@jwt_required()
def update_project(project_id):
    user_id = get_jwt_identity()

    project = Project.query.filter_by(
        id=project_id,
        user_id=user_id
    ).first()

    if not project:
        return jsonify({"error": "Projet non trouvé"}), 404

    data = request.get_json()

    project.name = data.get("name", project.name)
    project.description = data.get("description", project.description)

    db.session.commit()

    return jsonify({"message": "Projet mis à jour"}), 200


# ==============================
# Supprimer projet
# ==============================

@project_bp.route("/<int:project_id>", methods=["DELETE"])
@jwt_required()
def delete_project(project_id):
    user_id = get_jwt_identity()

    project = Project.query.filter_by(
        id=project_id,
        user_id=user_id
    ).first()

    if not project:
        return jsonify({"error": "Projet non trouvé"}), 404

    db.session.delete(project)
    db.session.commit()

    return jsonify({"message": "Projet supprimé"}), 200




