import json
from flask import Flask, make_response, jsonify
from flask_restful_swagger_3 import Api, swagger, get_swagger_blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from jsonschema.exceptions import ValidationError
from .blacklist import Blacklist


db = SQLAlchemy()
ma = Marshmallow()
blacklist = Blacklist()

config = None


def create_app():
    app = Flask(__name__)
    app.config.from_file("config.json", load=json.load)
    db.init_app(app)
    ma.init_app(app)
    CORS(app)
    global config
    config = app.config

    from .models import Client, Service, Payment, ServicePayment, User, UserClient, Taxes
    migrate = Migrate(app=app, db=db)

    from website.routes.echo import Echo
    from website.routes.client import ClientApi, ClientsApi
    from website.routes.clientService import ClientService
    from website.routes.login import Login
    from website.routes.payment import PaymentsApi, PaymentApi, ClientPayment
    from website.routes.register import Register
    from website.routes.service import ServicesApi, ServiceApi, ServiceRange
    from website.routes.servicePayment import PaymentServices, ServicePayments, ServicePaymentApi, ServicePaymentsApi
    from website.routes.userClient import UserClientApi, UserClientDelete
    from website.routes.reports import ReportsTotalApi, ReportsClientsTotalApi, ReportsClientsMonthApi
    from website.routes.taxes import TaxesApi, TaxApi
    from website.routes.logout import Logout
    from .context import UserRepository


    try:
        with app.app_context():
            user_repository = UserRepository(db)
            if not user_repository.get_any_admin():
                user = user_repository.new(config["ADMIN_NAME"], config["ADMIN_PASSWORD"], is_admin=True)
                user_repository.create(user)
    except Exception as e:
        print(e)
        print("Cant create SU")

    @app.errorhandler(400)
    def bad_request(error):
        if isinstance(error.description, ValidationError):
            original_error = error.description
            return make_response(jsonify({'message': str(original_error.path[0]) + " " + str(original_error.message)}),
                                 400)
        return error

    api = Api(app)
    routes = [
        (Echo, '/api/echo'),
        (ClientApi, '/api/client/<id>'),
        (ClientsApi, '/api/clients'),
        (ServicesApi, '/api/services'),
        (ServiceApi, '/api/service/<id>'),
        (ServiceRange, '/api/services/range/<dateFrom>/<dateTo>'),
        (ClientService, '/api/client/<client_id>/services'),
        (PaymentsApi, '/api/payments'),
        (PaymentApi, '/api/payment/<id>'),
        (ClientPayment, '/api/client/<client_id>/payments'),
        (PaymentServices, '/api/payment/<payment_id>/services'),
        (ServicePayments, '/api/service/<service_id>/payments'),
        (ServicePaymentsApi, '/api/servicepayment'),
        (ServicePaymentApi, '/api/servicepayment/<id>'),
        (Register, '/api/register'),
        (Login, '/api/login'),
        (Logout, '/api/logout'),
        (UserClientApi, '/api/userclient'),
        (UserClientDelete, '/api/userclient/<id>'),
        (ReportsTotalApi, '/api/reports/total'),
        (ReportsClientsTotalApi, '/api/reports/clients'),
        (ReportsClientsMonthApi, '/api/reports/clients/<date>'),
        (TaxApi, '/api/tax/<id>'),
        (TaxesApi, '/api/taxes')
    ]
    for apiClass, url in routes:
        api.add_resource(apiClass, url)

    SWAGGER_URL = '/api/doc'  # URL for exposing Swagger UI (without trailing '/')
    API_URL = 'swagger.json'  # Our API url (can of course be a local resource)

    swagger_blueprint = get_swagger_blueprint(
        api.open_api_object,
        swagger_prefix_url=SWAGGER_URL,
        swagger_url=API_URL)

    app.register_blueprint(swagger_blueprint)

    return app
