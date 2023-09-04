from flask_restful_swagger_3 import Resource, request
from flask import jsonify, make_response
from sqlalchemy import func

from website.authorization import authorize_jwt
from website.models import db, ServicePayment
from flask_expects_json import expects_json
from website.schemas import service_payment_schema, service_payment_post_schema, service_payment_put_schema, \
    service_payments_schema

from website.context import ServiceRepository, PaymentRepository, ServicePaymentRepository

service_repository = ServiceRepository(db)
payment_repository = PaymentRepository(db)
service_payment_repository = ServicePaymentRepository(db)


class PaymentServices(Resource):
    @authorize_jwt(admin_only=True)
    def get(self, payment_id):
        payment_for_services = service_payment_repository.filter_by_payment_id(payment_id)

        if not payment_for_services:
            return make_response(jsonify(error=f"Payment not found"), 404)

        return jsonify(service_payments_schema.dump(payment_for_services))


class ServicePayments(Resource):
    @authorize_jwt(admin_only=True)
    def get(self, service_id):
        service_for_payments = service_payment_repository.filter_by_service_id(service_id)
        if not service_for_payments:
            return make_response(jsonify(error=f"Service not found"), 404)
        return jsonify(service_payments_schema.dump(service_for_payments))


class ServicePaymentsApi(Resource):
    @authorize_jwt(admin_only=True)
    @expects_json(service_payment_post_schema)
    def post(self):
        service_id = request.json['service_id']
        amount = request.json['amount']
        payment_id = request.json['payment_id']

        service = service_repository.get_service(service_id)
        payment = payment_repository.get_payment(payment_id)

        if not service:
            return make_response(jsonify(error=f"Service {service_id} not found"), 404)

        if not payment:
            return make_response(jsonify(error=f"Payment {payment_id} not found"), 404)

        total_amount_saved = service_payment_repository.total_amount_for_service(service_id)
        total_amount_saved = total_amount_saved if total_amount_saved else 0

        if amount > service.price - total_amount_saved:
            return make_response(jsonify(error=f"Amount {amount} is too big for service remaining price {service.price - total_amount_saved}"), 400)

        total_amount = service_payment_repository.total_amount_for_payment(payment_id)
        if total_amount and amount > payment.amount - total_amount:
            return make_response(jsonify(error=f"Amount {amount} is too big, remaining cash: {payment.amount - total_amount}"), 400)

        new_service_payment = service_payment_repository.new(service_id=service_id, amount=amount,
                                                             payment_id=payment_id)
        service_payment_repository.create(new_service_payment)
        return make_response(jsonify(message="added", service_payment_id=new_service_payment.id), 201)


class ServicePaymentApi(Resource):
    @authorize_jwt(admin_only=True)
    @expects_json(service_payment_put_schema)
    def put(self, id):
        service_payment = service_payment_repository.get(id)
        amount = request.json['amount']

        service_payment.amount = amount
        service_payment_repository.save_changes()
        return jsonify(service_payment_schema.dump(service_payment))

    @authorize_jwt(admin_only=True)
    def delete(self, id):
        service_payment = service_payment_repository.get(id)
        service_payment_repository.delete(service_payment)
        return jsonify(message="Removed")
