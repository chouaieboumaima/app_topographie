import uuid
from datetime import datetime
from extensions import db


# =========================
# USER
# =========================
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(
        db.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    role = db.Column(db.String(20), default="user")
    is_active = db.Column(db.Boolean, default=True)

    created_at = db.Column(db.DateTime, server_default=db.func.now())

    reset_code = db.Column(db.String(6), nullable=True)
    reset_code_expiry = db.Column(db.DateTime, nullable=True)

    # 🔔 Push token (simple - 1 device)
    push_token = db.Column(db.Text, nullable=True)

    # 🔔 Multi-device (option recommandé)
    # push_tokens = db.Column(db.JSON, default=list)

    # Relations
    projects = db.relationship(
        "Project",
        backref="user",
        cascade="all, delete-orphan",
        lazy=True
    )

    notifications = db.relationship(
        "Notification",
        backref="user",
        cascade="all, delete-orphan",
        lazy=True,
        order_by="desc(Notification.created_at)"
    )


# =========================
# PROJECT
# =========================
class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)

    status = db.Column(
        db.String(50),
        default="pending",
        index=True
    )

    file_url = db.Column(db.String(500))
    cleaned_file_url = db.Column(db.String(500))

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        index=True
    )

    user_id = db.Column(
        db.String(36),
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )


# =========================
# NOTIFICATION
# =========================
class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.String(36),
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)

    created_at = db.Column(
        db.DateTime,
        default=db.func.now(),
        index=True
    )

    # pour gérer "lu / non lu"
    is_read = db.Column(db.Boolean, default=False, index=True)

    # (optionnel) type de notification
    type = db.Column(db.String(50), nullable=True)
    # ex: "project", "system", "alert"