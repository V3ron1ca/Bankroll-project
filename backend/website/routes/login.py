from flask_restful_swagger_3 import Resource, request
from flask import jsonify, make_response
from werkzeug.security import check_password_hash
from datetime import datetime, timedelta

from website.models import db
from flask_expects_json import expects_json
from website.schemas import user_login_schema
import jwt
from .. import config
from website.context import UserRepository
from ..hashing import HMACSHA512

user_repository = UserRepository(db)

class Login(Resource):
    @expects_json(user_login_schema)
    def post(self):
        data = request.json
        user = user_repository.filter_by_username(username=data.get('username'))
        if not user:
            return make_response(jsonify(error='User does not exists'), 404)

        hmac = HMACSHA512(user.password_salt)
        if hmac.compare_hash(data.get('password'), user.password):
            token = jwt.encode({
                'id': user.id,
                'exp': datetime.utcnow() + timedelta(minutes=config['TOKEN_EXPIRATION_MIN'])
            }, config["SECRET_KEY"], algorithm="HS256")

            return make_response(jsonify({'token': token}), 200)
        return make_response(jsonify(error='Wrong password'), 401)
