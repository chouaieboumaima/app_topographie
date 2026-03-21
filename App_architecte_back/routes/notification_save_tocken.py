# routes/notification_routes.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User
from extensions import db

notif_bp = Blueprint("notif_bp", __name__)

@notif_bp.route("/save-token", methods=["POST"])
@jwt_required()
def save_token():
    user_id = get_jwt_identity()
    data = request.json

    token = data.get("token")

    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    user.push_token = token
    db.session.commit()

    return jsonify({"message": "Token saved"})