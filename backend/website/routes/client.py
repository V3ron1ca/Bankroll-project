from flask_restful_swagger_3 import Resource, request, swagger
from flask import jsonify, make_response
from sqlalchemy import inspect

from website.models import db
from flask_expects_json import expects_json
from website.schemas import client_post_schema, clients_schema, client_schema, client_put_schema, ClientModel

from website.context import ClientRepository
from ..authorization import authorize_jwt

client_repository = ClientRepository(db)


class ClientsApi(Resource):
    @authorize_jwt(admin_only=True)
    def get(self):
        clients = client_repository.get_all()
        results = clients_schema.dump(clients)
        return jsonify(results)

    @authorize_jwt(admin_only=True)
    @expects_json(client_post_schema)
    def post(self):
        full_name = request.json['full_name']
        discord = request.json.get("discord", None)
        phone_number = request.json.get("phone_number", None)
        anydesk = request.json.get("anydesk", None)
        city = request.json.get("city", None)
        email = request.json.get("email", None)
        default_price = request.json.get("default_price", None)

        client = client_repository.filter_by_full_name(full_name=full_name)
        if client:
            return make_response(jsonify(message="Client's name already exists"), 400)
        else:
            new_client = client_repository.new(full_name=full_name, email=email, discord=discord,
                                               phone_number=phone_number, anydesk=anydesk, city=city,
                                               default_price=default_price)
            client_repository.create(new_client)
            return make_response(jsonify(message="added", client_id=new_client.id), 201)


class ClientApi(Resource):
    @authorize_jwt(admin_only=True)
    @swagger.reorder_with(ClientModel, description="Heartbeat", summary="")
    def get(self, id):
        client = client_repository.get(id)
        return jsonify(client_schema.dump(client))
        # return ClientModel(client)

    @authorize_jwt(admin_only=True)
    def delete(self, id):
        client = client_repository.get(id)
        if client.services:
            return jsonify(error="You have to delete service first!")

        client_repository.delete(client)
        return jsonify(message="Client removed")

    @authorize_jwt(admin_only=True)
    @expects_json(client_put_schema)
    def put(self, id):
        client = client_repository.get(id)
        data = request.json

        inst = inspect(type(client))
        attr_names = [c_attr.key for c_attr in inst.mapper.column_attrs]
        client_data = {}
        for name in attr_names:
            client_data[name] = data.get(name, getattr(client, name))

        client_repository.update(id, client_data)
        return make_response(jsonify(message="updated", client_id=id), 200)

