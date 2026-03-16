#!/usr/bin/env python3
from flask_migrate import Migrate  
from server.config import db
from flask import Flask,make_response, render_template
from werkzeug.exceptions import NotFound
from .config import config_app
from  .models import *
from  .routes import api_pb

migrate = Migrate()

def create_app():
    
    app = Flask(
        __name__,
        static_url_path='',
        static_folder='../client/dist',
        template_folder='../client/dist'
    )
    config_app(app)
    app.register_blueprint(api_pb)
    
    @app.errorhandler(404)
    def not_found(e):
        return render_template("index.html")

    return app
