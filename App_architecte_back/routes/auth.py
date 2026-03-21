# routes/auth.py
import re
import random
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db, mail
from models import User
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity
)
from flask_mail import Message

auth_bp = Blueprint("auth_bp", __name__)

# -------------------------------
# 🔹 REGISTER
# -------------------------------
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Données invalides"}), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    password_confirm = data.get("password_confirm")

    if not all([name, email, password, password_confirm]):
        return jsonify({"error": "Champs manquants"}), 400

    if password != password_confirm:
        return jsonify({"error": "Les mots de passe ne correspondent pas"}), 400

    if len(password) < 8:
        return jsonify({"error": "Le mot de passe doit contenir au moins 8 caractères"}), 400

    password_regex = r"^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$"
    if not re.match(password_regex, password):
        return jsonify({
            "error": "Le mot de passe doit contenir au moins : 1 majuscule, 1 chiffre et 1 caractère spécial"
        }), 400

    email_regex = r"[^@]+@[^@]+\.[^@]+"
    if not re.match(email_regex, email):
        return jsonify({"error": "Email invalide"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Utilisateur déjà existant"}), 400

    hashed_password = generate_password_hash(password)
    user = User(name=name, email=email, password_hash=hashed_password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Utilisateur créé avec succès"}), 201

# -------------------------------
# 🔹 LOGIN
# -------------------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Données invalides"}), 400

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404

    if not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Mot de passe incorrect"}), 401

    if not user.is_active:
        return jsonify({"error": "Compte désactivé"}), 403

    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    return jsonify({
        "message": "Connexion réussie",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role
        }
    }), 200

# -------------------------------
# 🔹 GET /me
# -------------------------------
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "is_active": user.is_active
    }), 200

# -------------------------------
# 🔹 PUT /me (update profile)
# -------------------------------
@auth_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_me():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404

    data = request.get_json()
    name = data.get("name")
    email = data.get("email")

    if name:
        user.name = name
    if email:
        user.email = email

    db.session.commit()

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "is_active": user.is_active
    }), 200

# -------------------------------
# 🔹 POST /refresh (refresh token)
# -------------------------------
@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()
    access_token = create_access_token(identity=user_id)
    return jsonify({"access_token": access_token}), 200

# -------------------------------
# 🔹 PUT /change-password
# -------------------------------
@auth_bp.route("/change-password", methods=["PUT"])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    data = request.get_json()
    current_password = data.get("current_password")
    new_password = data.get("new_password")

    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404

    if not check_password_hash(user.password_hash, current_password):
        return jsonify({"error": "Mot de passe actuel incorrect"}), 401

    if not new_password or len(new_password) < 6:
        return jsonify({"error": "Nouveau mot de passe faible"}), 400

    user.password_hash = generate_password_hash(new_password)
    db.session.commit()
    return jsonify({"message": "Mot de passe modifié avec succès"}), 200

# -------------------------------
# 🔹 POST /forgot-password
# -------------------------------
@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = data.get("email")
    if not email:
        return jsonify({"error": "Email requis"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404

    code = str(random.randint(100000, 999999))
    user.reset_code = code
    user.reset_code_expiry = datetime.utcnow() + timedelta(minutes=10)
    db.session.commit()

    msg = Message(
        subject="Code de réinitialisation",
        sender="ton_email@gmail.com",
        recipients=[email],
        body=f"Votre code de réinitialisation est : {code}. Il est valable 10 minutes."
    )
    mail.send(msg)

    return jsonify({"message": "Code de réinitialisation envoyé à votre email"}), 200

# -------------------------------
# 🔹 POST /reset-password
# -------------------------------
@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()
    email = data.get("email")
    code = data.get("code")
    new_password = data.get("new_password")
    password_confirm = data.get("password_confirm")

    if not all([email, code, new_password, password_confirm]):
        return jsonify({"error": "Champs manquants"}), 400

    if new_password != password_confirm:
        return jsonify({"error": "Les mots de passe ne correspondent pas"}), 400

    password_regex = r"^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$"
    if not re.match(password_regex, new_password):
        return jsonify({
            "error": "Le mot de passe doit contenir au moins : 1 majuscule, 1 chiffre et 1 caractère spécial"
        }), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404

    if user.reset_code != code:
        return jsonify({"error": "Code incorrect"}), 400
    if not user.reset_code_expiry or user.reset_code_expiry < datetime.utcnow():
        return jsonify({"error": "Code expiré"}), 400

    user.password_hash = generate_password_hash(new_password)
    user.reset_code = None
    user.reset_code_expiry = None
    db.session.commit()

    return jsonify({"message": "Mot de passe réinitialisé avec succès"}), 200