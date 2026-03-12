from sqlalchemy_serializer import SerializerMixin
from ..config import db

class Supplier(db.Model, SerializerMixin):
    __tablename__ = 'suppliers'
    
    # Exclude products from serialization to avoid deep nesting
    serialize_rules = ('-products.supplier',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    contact = db.Column(db.String)

    # Relationship to Product
    products = db.relationship('Product', backref='supplier', lazy=True)

    def __repr__(self):
        return f'<Supplier {self.name}>'