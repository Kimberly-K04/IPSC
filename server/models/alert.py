<<<<<<< HEAD
from ..config import db
from flask import Blueprint, jsonify, request
=======
from server.config import db
from sqlalchemy_serializer import SerializerMixin
>>>>>>> 15da04f (fixing alerts.py)


class Alert(db.Model, SerializerMixin):
    __tablename__ = "alerts"

    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(255), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=True)
    status = db.Column(db.String(20), nullable=False, default="unread")
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())