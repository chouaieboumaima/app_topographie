from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import User,Project

admin_bp = Blueprint("admin_bp", __name__)

# 🔹 Vérification rôle admin
def admin_required():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != "admin":
        return None
    return user


# 🔹 Lister tous les utilisateurs
@admin_bp.route("/users", methods=["GET"])
@jwt_required()
def get_users():

    if not admin_required():
        return jsonify({"error": "Accès interdit"}), 403

    users = User.query.all()

    return jsonify([
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "is_active": u.is_active
        } for u in users
    ])


# 🔹 Activer compte
@admin_bp.route("/users/<user_id>/activate", methods=["PUT"])
@jwt_required()
def activate_user(user_id):

    if not admin_required():
        return jsonify({"error": "Accès interdit"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404

    user.is_active = True
    db.session.commit()

    return jsonify({"message": "Compte activé"})


# 🔹 Désactiver compte
@admin_bp.route("/users/<user_id>/deactivate", methods=["PUT"])
@jwt_required()
def deactivate_user(user_id):

    if not admin_required():
        return jsonify({"error": "Accès interdit"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404

    user.is_active = False
    db.session.commit()

    return jsonify({"message": "Compte désactivé"})


# 🔹 Supprimer compte
@admin_bp.route("/users/<user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):

    if not admin_required():
        return jsonify({"error": "Accès interdit"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "Compte supprimé"})



# 🔹 GET /stats
@admin_bp.route("/stats", methods=["GET"])
@jwt_required()
def admin_stats():
    user = admin_required()
    if isinstance(user, tuple):
        return user

    total_users = User.query.count()
    active_users = User.query.filter_by(is_active=True).count()
    inactive_users = User.query.filter_by(is_active=False).count()
    total_projects = Project.query.count()

    return jsonify({
        "total_users": total_users,
        "active_users": active_users,
        "inactive_users": inactive_users,
        "total_projects": total_projects
    })