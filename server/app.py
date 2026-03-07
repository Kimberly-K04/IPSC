#!/usr/bin/env python3
from flask import Flask
from .config import app
from  .models import *
def create_app():
    
    # @app.route("/")
    # def hello():
    #     return "Hello, World!"

    return app
