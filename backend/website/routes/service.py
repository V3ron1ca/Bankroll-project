from datetime import datetime, timedelta

from flask_restful_swagger_3 import Resource, request
from flask import jsonify, make_response
from sqlalchemy import inspect
from website.authorization import authorize_jwt
from website.models import db, Service
from flask_expects_json import expects_json
from website.schemas import services_schema, service_schema, service_post_schema, service_put_schema

from website.context import ServiceRepository, ClientRepository



client_repository = ClientRepository(db)
service_repository = ServiceRepository(db)


class ServicesApi(Resource):
    @authorize_jwt(admin_only=True)
    def get(self):
        services = service_repository.get_all()
        results = services_schema.dump(services)
        return jsonify(results)

    @authorize_jwt(admin_only=True)
    @expects_json(service_post_schema)
    def post(self):
        client_id = request.json['client_id']
        time = request.json['time']
        note = request.json.get('note', None)
        date_of_work = request.json.get('date_of_work', None)
        price = request.json['price']
        service_type = request.json['service_type']

        if not client_repository.get(client_id):
            return make_response(jsonify(error=f"Client {client_id} not found"), 404)
        else:
            new_service = service_repository.new(client_id=client_id, time=time, note=note, date_of_work=date_of_work,
                                                 price=price, service_type=service_type)
            service_repository.create(new_service)
            return make_response(jsonify(message="added", service_id=new_service.id), 201)


class ServiceApi(Resource):
    # @authorize_jwt(admin_only=False)
    def get(self, id):
        service = service_repository.get(id)
        return jsonify(service_schema.dump(service))

    @authorize_jwt(admin_only=True)
    @expects_json(service_put_schema)
    def put(self, id):
        service = service_repository.get(id)
        data = request.json

        inst = inspect(service_repository.db)
        attr_names = [c_attr.key for c_attr in inst.mapper.column_attrs]
        service_data = {}
        for name in attr_names:
            service_data[name] = data.get(name, getattr(service, name))

        service_repository.update(id, service_data)
        return jsonify(service_schema.dump(service))

    @authorize_jwt(admin_only=True)
    def delete(self, id):
        service = service_repository.get(id)
        service_repository.delete(service)
        return jsonify(message="Service removed")

class ServiceRange(Resource):
    @authorize_jwt(admin_only=True)
    def get(self, dateFrom, dateTo):
        try:
            dateFrom = datetime.strptime(dateFrom, "%Y-%m-%d")
            dateTo = datetime.strptime(dateTo, "%Y-%m-%d")
        except Exception:
            return jsonify(message="Invalid date format")
        result = list(service_repository.get_range(dateFrom, dateTo))
        return jsonify(services_schema.dump(result))
