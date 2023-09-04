from flask import request, make_response, jsonify
from flask_expects_json import expects_json
from flask_restful_swagger_3 import Resource
from sqlalchemy import inspect

from website.models import db
from website.authorization import authorize_jwt

from website.schemas import taxes_schema, tax_schema, tax_put_schema, tax_post_schema
from website.context import TaxRepository
tax_repository = TaxRepository(db)


class TaxesApi(Resource):
    @authorize_jwt(admin_only=True)
    def get(self):
        taxes = tax_repository.get_all()
        results = taxes_schema.dump(taxes)
        return results

    @authorize_jwt(admin_only=True)
    @expects_json(tax_post_schema)
    def post(self):
        date_input_tax = request.json.get('date_input_tax')
        zus = request.json.get('zus')
        nfz = request.json.get('nfz')
        pit = request.json.get('pit')
        percent = request.json.get('percent')

        new_tax = tax_repository.new(date_input_tax=date_input_tax, zus=zus, nfz=nfz,
                                     pit=pit, percent=percent)
        tax_repository.create(new_tax)
        return make_response(jsonify(message="added", tax_id=new_tax.id), 201)


class TaxApi(Resource):
    @authorize_jwt(admin_only=True)
    def get(self, id):
        tax = tax_repository.get(id)
        return jsonify(tax_schema.dump(tax))

    @authorize_jwt(admin_only=True)
    @expects_json(tax_put_schema)
    def put(self, id):
        tax = tax_repository.get(id)
        data = request.json

        inst = inspect(tax_repository.db)
        attr_names = [c_attr.key for c_attr in inst.mapper.column_attrs]
        tax_data = {}
        for name in attr_names:
            tax_data[name] = data.get(name, getattr(tax, name))

        tax_repository.update(id, tax_data)
        return jsonify(tax_schema.dump(tax))

    @authorize_jwt(admin_only=True)
    def delete(self, id):
        tax = tax_repository.get(id)
        tax_repository.delete(tax)
        return jsonify(message="Tax removed")
