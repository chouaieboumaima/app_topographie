from flask import Flask
from config import Config
from extensions import db, jwt,mail,migrate
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    migrate.init_app(app, db)
    # Import Blueprints
    from routes.auth import auth_bp
    from routes.admin import admin_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    from routes.project import project_bp
    app.register_blueprint(project_bp, url_prefix="/api/projects")
    from routes.files import file_bp  
    app.register_blueprint(file_bp, url_prefix="/api/files")
    from routes.notification_routes import notif_bp
    app.register_blueprint(notif_bp, url_prefix="/api")
    @app.route("/")
    def home():
        return "Backend is running 🚀"

    with app.app_context():
        db.create_all()

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)