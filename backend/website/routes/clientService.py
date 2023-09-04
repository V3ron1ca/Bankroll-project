from flask_restful_swagger_3 import Resource
from flask import request, make_response, jsonify

from website import config
from website.authorization import authorize_jwt, get_user_from_token
from website.models import db
from website.schemas import services_schema

from website.context import ServiceRepository, UserClientRepository

service_repository = ServiceRepository(db)
user_client_repository = UserClientRepository(db)


class ClientService(Resource):
    @authorize_jwt(admin_only=False)
    def get(self, client_id):
        if config["NO_AUTHORIZATION"]:
            services_by_client = service_repository.filter_by_client_id(client_id=client_id)
            results = services_schema.dump(services_by_client)
            return results

        jwt_token = request.headers.get("Authorization")
        user = get_user_from_token(jwt_token)
        user_client = user_client_repository.filter_by(client_id=client_id, user_id=user.id)

        if user_client or user.is_admin:
            services_by_client = service_repository.filter_by_client_id(client_id=client_id)
            results = services_schema.dump(services_by_client)
            return results
        else:
            return make_response(jsonify(message="There is no connection"), 401)
