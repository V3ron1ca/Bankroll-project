from flask_restful_swagger_3 import Resource
from flask import request, jsonify

from website import blacklist
from website.authorization import authorize_jwt, get_user_from_token


class Logout(Resource):
    @authorize_jwt(admin_only=False)
    def post(self):
        jwt_token = request.headers.get("Authorization")
        blacklist.add_token(jwt_token)
        return jsonify(msg="Logged out")
