from flask_restful_swagger_3 import Resource
from flask import jsonify

class Echo(Resource):
    def get(self):
        return jsonify(message="It works")