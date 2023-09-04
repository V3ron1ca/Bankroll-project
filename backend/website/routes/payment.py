from flask_restful_swagger_3 import Resource, request
from flask import jsonify, make_response
from sqlalchemy import inspect

from website.authorization import authorize_jwt
from website.models import db
from flask_expects_json import expects_json
from website.schemas import payments_schema, payment_schema, payment_post_schema, payment_put_schema

from website.context import PaymentRepository, ClientRepository

payment_repository = PaymentRepository(db)
client_repository = ClientRepository(db)

class PaymentsApi(Resource):
    @authorize_jwt(admin_only=True)
    def get(self):
        payments = payment_repository.get_all()
        results = payments_schema.dump(payments)
        return jsonify(results)

    @authorize_jwt(admin_only=True)
    @expects_json(payment_post_schema)
    def post(self):
        client_id = request.json['client_id']
        amount = request.json['amount']
        source = request.json['source']
        account_number = request.json.get('account_number', None)
        date_income = request.json['date_income']
        date_book = request.json.get('date_book', None)
        tax = request.json.get('tax', None)

        if not client_repository.get(client_id):
            return make_response(jsonify(error=f"Client not found"), 404)
        else:
            new_payment = payment_repository.new(client_id=client_id, amount=amount, source=source,
                                                 account_number=account_number, date_income=date_income,
                                                 date_book=date_book, tax=tax)
            payment_repository.create(new_payment)
            return make_response(jsonify(message="added", payment_id=new_payment.id), 201)


class PaymentApi(Resource):
    @authorize_jwt(admin_only=True)
    def get(self, id):
        payment = payment_repository.get(id)
        return jsonify(payment_schema.dump(payment))

    @authorize_jwt(admin_only=True)
    @expects_json(payment_put_schema)
    def put(self, id):
        payment = payment_repository.get(id)
        data = request.json

        inst = inspect(payment_repository.db)
        attr_names = [c_attr.key for c_attr in inst.mapper.column_attrs]
        payment_data = {}
        for name in attr_names:
            payment_data[name] = data.get(name, getattr(payment, name))

        payment_repository.update(id, payment_data)
        return jsonify(payment_schema.dump(payment))

    @authorize_jwt(admin_only=True)
    def delete(self, id):
        payment = payment_repository.get(id)
        payment_repository.delete(payment)
        return jsonify(message="Payment removed")

class ClientPayment(Resource):
    @authorize_jwt(admin_only=True)
    def get(self, client_id):
        payments_by_client = payment_repository.filter_by_client_id(client_id)
        results = payments_schema.dump(payments_by_client)
        return jsonify(results)
