from . import db
import uuid
from sqlalchemy import func, text


class Client(db.Model):
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name = db.Column(db.String(100), unique=True)
    email = db.Column(db.String(150), unique=True, nullable=True)
    discord = db.Column(db.String(100), default="", nullable=True)
    phone_number = db.Column(db.String(20), nullable=True)
    anydesk = db.Column(db.String(9), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    date_added = db.Column(db.DateTime(timezone=True), default=func.now())
    default_price = db.Column(db.Float, nullable=True)
    services = db.relationship("Service", backref='client', lazy=True)
    payments = db.relationship("Payment", backref='client', lazy=True)
    user_client = db.relationship("UserClient", backref='client', lazy=True)


class Service(db.Model):
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    client_id = db.Column(db.String, db.ForeignKey('client.id'))
    time = db.Column(db.Integer)
    date_of_work = db.Column(db.DateTime, nullable=True)
    note = db.Column(db.String(300), nullable=True)
    price = db.Column(db.Float)
    service_type = db.Column(db.String(10))
    date_created = db.Column(db.DateTime(timezone=True), default=func.now())
    service_payment = db.relationship("ServicePayment", backref='service', lazy=True)


class Payment(db.Model):
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    client_id = db.Column(db.String, db.ForeignKey('client.id'))
    amount = db.Column(db.Float)
    source = db.Column(db.String(100))
    account_number = db.Column(db.String(80), nullable=True)
    date_income = db.Column(db.DateTime)
    date_book = db.Column(db.DateTime, nullable=True)
    tax = db.Column(db.Float, nullable=True)
    service_payment = db.relationship("ServicePayment", backref='payment', lazy=True)


class ServicePayment(db.Model):
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    payment_id = db.Column(db.String, db.ForeignKey('payment.id'))
    service_id = db.Column(db.String, db.ForeignKey('service.id'))
    amount = db.Column(db.Float)


class User(db.Model):
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(200))
    password_salt = db.Column(db.LargeBinary)
    is_admin = db.Column(db.Boolean, default=False)
    user_client = db.relationship("UserClient", backref='user', lazy=True)


class UserClient(db.Model):
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    client_id = db.Column(db.String, db.ForeignKey('client.id'))
    user_id = db.Column(db.String, db.ForeignKey('user.id'))


class Taxes(db.Model):
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    date_input_tax = db.Column(db.DateTime, nullable=False)
    zus = db.Column(db.Float, nullable=True)
    nfz = db.Column(db.Float, nullable=True)
    pit = db.Column(db.Float, nullable=True)
    percent = db.Column(db.Float, nullable=True)
