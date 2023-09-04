from flask_restful_swagger_3 import Resource, request
from flask import jsonify, make_response

from website.authorization import authorize_jwt
from website.models import db
from flask_expects_json import expects_json
from website.schemas import user_post_schema

from website.context import UserRepository

user_repository = UserRepository(db)


class Register(Resource):
    @authorize_jwt(admin_only=True)
    @expects_json(user_post_schema)
    def post(self):
        username = request.json['username']
        password1 = request.json['password1']
        password2 = request.json['password2']

        user = user_repository.filter_by_username(username=username)
        if user:
            return make_response(jsonify(error='User already exists'), 400)
        elif password1 != password2:
            return make_response(jsonify(error='Password does not match'), 400)
        else:
            new_user = user_repository.new(username=username, password1=password1)
            user_repository.create(new_user)
            return make_response(jsonify(message="Account created", user_id=new_user.id), 201)