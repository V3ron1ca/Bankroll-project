from flask_restful_swagger_3 import Resource, request
from flask import jsonify, make_response

from website.authorization import authorize_jwt
from website.models import db
from flask_expects_json import expects_json
from website.schemas import user_client_post_schema
from website.context import ClientRepository, UserRepository, UserClientRepository

client_repository = ClientRepository(db)
user_repository = UserRepository(db)
user_client_repository = UserClientRepository(db)

class UserClientApi(Resource):
    @authorize_jwt(admin_only=True)
    @expects_json(user_client_post_schema)
    def post(self):
        client_id = request.json['client_id']
        user_id = request.json['user_id']

        if not client_repository.get_client(client_id):
            return make_response(jsonify(error=f"Client {client_id} not found"), 404)

        if not user_repository.get_user(user_id):
            return make_response(jsonify(error=f"User {user_id} not found"), 404)

        else:
            new_client_user = user_client_repository.new(client_id=client_id, user_id=user_id)
            user_client_repository.create(new_client_user)
            return make_response(jsonify(message="Account created", client_user_id=new_client_user.id), 201)


class UserClientDelete(Resource):
    @authorize_jwt(admin_only=True)
    def delete(self, id):
        user_client = user_client_repository.get(id)
        user_client_repository.delete(user_client)
        return jsonify(message="Removed")