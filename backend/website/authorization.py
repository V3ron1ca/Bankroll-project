import datetime
from functools import wraps

import jwt
from flask import current_app, request, make_response, jsonify


from . import config, db, blacklist
from .context import UserRepository

user_repository = UserRepository(db)


def get_user_from_token(jwt_token):
    try:
        if blacklist.token_exists(jwt_token):
            raise Exception("Token on blacklist")

        decode_data = jwt.decode(jwt=jwt_token.replace("Bearer ", ""), \
                                 key=config["SECRET_KEY"], algorithms="HS256")
        if datetime.datetime.now() > datetime.datetime.fromtimestamp(decode_data["exp"]):
            raise Exception("Token expired")
        return user_repository.get_user(decode_data["id"])
    except Exception as e:
        message = f"Token is invalid --> {e}"
        print({"message": message})


def authorize_jwt(admin_only):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if config["NO_AUTHORIZATION"]:
                return f(*args, **kwargs)

            jwt_token = request.headers.get("Authorization")
            user = get_user_from_token(jwt_token)
            if not user:
                return make_response(jsonify(message="JWT token invalid"), 401)

            if admin_only and not user.is_admin:
                return make_response(jsonify(message="Invalid role"), 401)

            if hasattr(current_app, "ensure_sync"):
                return current_app.ensure_sync(f)(*args, **kwargs)
            else:
                return f(*args, **kwargs)

        return decorated_function

    return decorator

