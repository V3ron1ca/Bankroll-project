from sqlalchemy import func
from werkzeug.security import generate_password_hash

from .hashing import HMACSHA512
from .models import Client, Service, Payment, ServicePayment, User, UserClient, Taxes


class ClientRepository:
    def __init__(self, db):
        self.db = db

    def get_all(self):
        return self.db.session.query(Client).all()

    def get(self, id):
        return Client.query.get_or_404(id, description=f'Client with id {id} not found')

    def create(self, new_client):
        self.db.session.add(new_client)
        self.db.session.commit()
        self.db.session.flush()

    def update(self, id, client_data):
        Client.query.filter_by(id=id).update(client_data)
        self.db.session.commit()

    def filter_by_full_name(self, full_name):
        return Client.query.filter_by(full_name=full_name).first()

    def delete(self, client):
        self.db.session.delete(client)
        self.db.session.commit()

    def new(self, full_name, email, discord, phone_number, anydesk, city, default_price):
        return Client(full_name=full_name, email=email, discord=discord,
                      phone_number=phone_number, anydesk=anydesk, city=city,
                      default_price=default_price)

    def get_client(self, client_id):
        return Client.query.get(client_id)


class ServiceRepository:
    def __init__(self, db):
        self.db = db

    def get_all(self):
        return self.db.session.query(Service).all()

    def get(self, id):
        return Service.query.get_or_404(id, description=f'Service with id {id} not found')

    def create(self, new_service):
        self.db.session.add(new_service)
        self.db.session.commit()
        self.db.session.flush()

    def update(self, id, service_data):
        Service.query.filter_by(id=id).update(service_data)
        self.db.session.commit()

    def filter_by_client_id(self, client_id):
        return Service.query.filter_by(client_id=client_id)

    def get_service(self, service_id):
        return Service.query.get(service_id)

    def delete(self, service):
        self.db.session.delete(service)
        self.db.session.commit()

    def new(self, client_id, time, note, date_of_work, price, service_type):
        return Service(client_id=client_id, time=time, note=note, date_of_work=date_of_work,
                       price=price, service_type=service_type)

    def get_range(self, dateFrom, dateTo):
        return Service.query \
            .join(Client, Client.id == Service.client_id) \
            .filter((Service.date_of_work >= dateFrom) & (Service.date_of_work <= dateTo))


class PaymentRepository:
    def __init__(self, db):
        self.db = db

    def get_all(self):
        return self.db.session.query(Payment).all()

    def get(self, id):
        return Payment.query.get_or_404(id, description=f'Payment with id {id} not found')

    def update(self, id, payment_data):
        Payment.query.filter_by(id=id).update(payment_data)
        self.db.session.commit()

    def filter_by_client_id(self, client_id):
        return Payment.query.filter_by(client_id=client_id)

    def create(self, new_payment):
        self.db.session.add(new_payment)
        self.db.session.commit()
        self.db.session.flush()

    def get_payment(self, payment_id):
        return Payment.query.get(payment_id)

    def delete(self, payment):
        self.db.session.delete(payment)
        self.db.session.commit()

    def new(self, client_id, amount, source, account_number, date_income, date_book, tax):
        return Payment(client_id=client_id, amount=amount, source=source,
                       account_number=account_number, date_income=date_income,
                       date_book=date_book, tax=tax)


class ServicePaymentRepository:
    def __init__(self, db):
        self.db = db

    def get(self, id):
        return ServicePayment.query.get_or_404(id, description=f'ServicePayment not found')

    def filter_by_payment_id(self, payment_id):
        return ServicePayment.query.filter_by(payment_id=payment_id)

    def filter_by_service_id(self, service_id):
        return ServicePayment.query.filter_by(service_id=service_id).join(Payment,
                                                                          Payment.id == ServicePayment.payment_id)

    def save_changes(self):
        self.db.session.commit()

    def create(self, new_service_payment):
        self.db.session.add(new_service_payment)
        self.db.session.commit()
        self.db.session.flush()

    def delete(self, service_payment):
        self.db.session.delete(service_payment)
        self.db.session.commit()

    def new(self, service_id, amount, payment_id):
        return ServicePayment(service_id=service_id, amount=amount, payment_id=payment_id)

    def total_amount_for_service(self, service_id):
        return ServicePayment.query.filter_by(service_id=service_id).with_entities(
            func.sum(ServicePayment.amount).label('total')).first().total

    def total_amount_for_payment(self, payment_id):
        return ServicePayment.query.filter_by(payment_id=payment_id).with_entities(
            func.sum(ServicePayment.amount).label('total')).first().total


class UserRepository:
    def __init__(self, db):
        self.db = db

    def filter_by_username(self, username):
        return User.query.filter_by(username=username).first()

    def create(self, new_user):
        self.db.session.add(new_user)
        self.db.session.commit()
        self.db.session.flush()

    def new(self, username, password1, is_admin=False):
        hmac = HMACSHA512()
        return User(username=username, password=hmac.create_hash_str(password1), password_salt=hmac.salt,
                    is_admin=is_admin)

    def get_user(self, user_id):
        return User.query.get(user_id)

    def get_any_admin(self):
        return User.query.filter_by(is_admin=True).first()


class UserClientRepository:
    def __init__(self, db):
        self.db = db

    def get(self, id):
        return UserClient.query.get_or_404(id, description=f'Not found')

    def delete(self, user_client):
        self.db.session.delete(user_client)
        self.db.session.commit()

    def create(self, new_client_user):
        self.db.session.add(new_client_user)
        self.db.session.commit()
        self.db.session.flush()

    def new(self, client_id, user_id):
        return UserClient(client_id=client_id, user_id=user_id)

    def filter_by(self, **kwargs):
        return UserClient.query.filter_by(**kwargs).first()


class TaxRepository:
    def __init__(self, db):
        self.db = db

    def get_all(self):
        return self.db.session.query(Taxes).all()

    def get(self, id):
        return Taxes.query.get_or_404(id, description=f'Tax with id {id} not found')

    def create(self, new_tax):
        self.db.session.add(new_tax)
        self.db.session.commit()
        self.db.session.flush()

    def update(self, id, tax_data):
        Taxes.query.filter_by(id=id).update(tax_data)
        self.db.session.commit()

    def filter_by_tax_date(self, date_input_tax):
        return Taxes.query.filter_by(date_input_tax=date_input_tax)

    def delete(self, client):
        self.db.session.delete(client)
        self.db.session.commit()

    def new(self, date_input_tax, zus, nfz, pit, percent):
        return Taxes(date_input_tax=date_input_tax, zus=zus, nfz=nfz,
                     pit=pit, percent=percent)
