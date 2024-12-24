from flask import Flask

def create_app():
    app = Flask(__name__)

    # Import blueprints or routes
    from .routes import main  # Ensure main is a Blueprint in routes.py
    app.register_blueprint(main, url_prefix='/')  # Use a URL prefix if needed

    return app
