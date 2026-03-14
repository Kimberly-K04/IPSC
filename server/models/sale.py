
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import relationship 
from ..config import db

class Sale(db.Model, SerializerMixin):
    __tablename__="sales"  
    serialize_rules = ("-order.sales", '-product.sales',)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer,  db.ForeignKey("users.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Numeric(10,2), nullable=False)  
    created_at=db.Column(db.DateTime, server_default=db.func.now())

    # order = db.relationship("Order", back_populates="sales")


     
