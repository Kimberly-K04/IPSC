from sqlalchemy_serializer import SerializerMixin
from ..config import db

class Product(db.Model, SerializerMixin):
    __tablename__ = 'products'
    
    # Adding 'price_as_float' to the rules so the serializer picks it up
    serialize_rules = (
        '-supplier.products', 
        '-sales.product', 
        '-alerts.product',
        'price_as_float',  
    )

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    stock_quantity = db.Column(db.Integer, default=0)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=False)
    category=db.Column(db.String)

    # Relationships
    sales = db.relationship('Sale', backref='product', lazy=True)
    alerts = db.relationship('Alert', backref='product', lazy=True)

    @property
    def price_as_float(self):
        return float(self.price)

    def __repr__(self):
        return f'<Product {self.name}>'
    
   

# def to_dict(self):
#     return {
#         "id": self.id,
#         "name": self.name,
#         "category": self.category,  # Change this from "Electronics" to self.category
#         "stock": self.stock_quantity,
#         "price": self.price_as_float,
#         "supplier_id": self.supplier_id,
#         "sales": [s.to_dict() for s in self.sales] if hasattr(self, 'sales') else [],
#         "alerts": [a.to_dict() for a in self.alerts] if hasattr(self, 'alerts') else []
#     }