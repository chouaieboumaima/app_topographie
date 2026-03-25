from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Notification
from extensions import db

notif_bp = Blueprint("notif_bp", __name__)

# =========================
# 🔔 SAVE PUSH TOKEN
# =========================
@notif_bp.route("/save-token", methods=["POST"])
@jwt_required()
def save_token():

    user_id = get_jwt_identity()
    data = request.json

    token = data.get("token")

    if not token:
        return jsonify({"error": "Token missing"}), 400

    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    user.push_token = token

    db.session.commit()

    return jsonify({"message": "Token saved"}), 200


# =========================
# 📥 GET NOTIFICATIONS
# =========================
@notif_bp.route("/notifications", methods=["GET"])
@jwt_required()
def get_notifications():

    user_id = get_jwt_identity()

    notifications = Notification.query \
        .filter_by(user_id=user_id) \
        .order_by(Notification.created_at.desc()) \
        .all()

    result = []

    for n in notifications:
        result.append({
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "time": n.created_at.strftime("%H:%M"),
            "is_read": n.is_read
        })

    return jsonify(result), 200