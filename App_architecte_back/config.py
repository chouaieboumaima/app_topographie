import os

class Config:
    SQLALCHEMY_DATABASE_URI = "postgresql://postgres:postgres123@localhost:5432/nuage_db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = "super-secret-key"

# Flask-Mail
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = "pfeia321@gmail.com" # ton email
    MAIL_PASSWORD = "yaps ionr lsns essl"  # mot de passe d'application
    MAIL_DEFAULT_SENDER = "pfeia321@gmail.com"