from flask_restful_swagger_3 import Schema

from . import ma

user_client_post_schema = {
    "type": "object",
    "properties": {
        "client_id": {"type": "string"},
        "user_id": {"type": "string"}
    },
    "required": ["client_id", "user_id"]
}

user_login_schema = {
    "type": "object",
    "properties": {
        "username": {"type": "string",
                     "minLength": 2,
                     "maxLength": 50},
        "password": {"type": "string",
                     "minLength": 7,
                     "maxLength": 100},
    },
    "required": ["username", "password"]
}

user_post_schema = {
    "type": "object",
    "properties": {
        "username": {"type": "string",
                     "minLength": 2,
                     "maxLength": 50},
        "password1": {"type": "string",
                      "minLength": 7,
                      "maxLength": 100},
        "password2": {"type": "string",
                      "minLength": 7,
                      "maxLength": 100},
    },
    "required": ["username", "password1", "password2"]
}


class ServicePaymentSchema(ma.Schema):
    class Meta:
        fields = (
            'id', 'payment_id', 'service_id', 'amount', 'payment.date_income', 'payment.amount', 'payment.client_id')


service_payment_schema = ServicePaymentSchema()
service_payments_schema = ServicePaymentSchema(many=True)

service_payment_post_schema = {
    "type": "object",
    "properties": {
        "payment_id": {"type": "string"},
        "amount": {"type": "number"},
        "service_id": {"type": "string"}
    },
    "required": ["payment_id", "service_id", "amount"]
}
service_payment_put_schema = {
    "type": "object",
    "properties": {
        "amount": {"type": "number"},
    },
}


class PaymentSchema(ma.Schema):
    class Meta:
        fields = (
            'id', 'client_id', 'amount', 'source', 'account_number', 'date_income', 'date_book', 'tax',
            'client.full_name')


payment_schema = PaymentSchema()
payments_schema = PaymentSchema(many=True)

payment_post_schema = {
    "type": "object",
    "properties": {
        "id": {"type": "string"},
        "user_id": {"type": "string"},
        "amount": {"type": "number"},
        "source": {"type": "string",
                   "maxLength": 100},
        "account_number": {"type": "string",
                           "maxLength": 80},
        "date_income": {"type": "string"},
        "date_book": {"type": "string"},
        "tax": {"type": "number"}
    },
}
payment_put_schema = {
    "type": "object",
    "properties": {
        "id": {"type": "string"},
        "user_id": {"type": "string"},
        "amount": {"type": "number"},
        "source": {"type": "string",
                   "maxLength": 100},
        "account_number": {"type": "string",
                           "maxLength": 80},
        "date_income": {"type": "string"},
        "date_book": {"type": "string"},
        "tax": {"type": "number"}
    },
    "required": ["user_id", "amount", "source", "date_income"]
}


class ServiceSchema(ma.Schema):
    class Meta:
        fields = (
            'id', 'client_id', 'time', 'date_of_work', 'note', 'price', 'service_type', 'date_created',
            'client.full_name')


service_schema = ServiceSchema()
services_schema = ServiceSchema(many=True)

service_post_schema = {
    "type": "object",
    "properties": {
        "id": {"type": "string"},
        "client_id": {"type": "string"},
        "time": {"type": "number"},
        "note": {"type": "string",
                 "maxLength": 300},
        "date_of_work": {"type": "string",
                         "maxLength": 50},
        "price": {"type": "number"},
        "service_type": {"type": "string"}
    },
    "required": ["client_id"]
}

service_put_schema = {
    "type": "object",
    "properties": {
        "id": {"type": "string"},
        "client_id": {"type": "string"},
        "time": {"type": "number"},
        "note": {"type": "string",
                 "maxLength": 300},
        "date_of_work": {"type": "string",
                         "maxLength": 50},
        "price": {"type": "number"},
        "service_type": {"type": "string"}
    },
}


class ClientSchema(ma.Schema):
    class Meta:
        fields = (
            'id', 'full_name', 'email', 'discord', 'phone_number', 'anydesk', 'city', 'date_added', 'default_price')


client_schema = ClientSchema()
clients_schema = ClientSchema(many=True)

class ClientModel(Schema):
    type = 'object'
    properties = {
        "id": {"type": "string"},
        "full_name": {"type": "string",
                      "minLength": 2,
                      "maxLength": 100
                      },
        "email": {"type": "string",
                  "minLength": 2,
                  "maxLength": 150
                  },
        "discord": {"type": "string",
                    "minLength": 2,
                    "maxLength": 100
                    },
        "phone_number": {"type": "string",
                         "minLength": 2,
                         "maxLength": 20,
                         "pattern": r"^\+?[1-9][0-9]{7,14}$"
                         },
        "anydesk": {"type": "string",
                    "minLength": 2,
                    "maxLength": 9
                    },
        "city": {"type": "string",
                 "minLength": 2,
                 "maxLength": 100
                 },
        "default_price": {"type": "number"}
    }


client_post_schema = {
    "type": "object",
    "properties": {
        "id": {"type": "string"},
        "full_name": {"type": "string",
                      "minLength": 2,
                      "maxLength": 100
                      },
        "email": {"type": "string",
                  "minLength": 2,
                  "maxLength": 150
                  },
        "discord": {"type": "string",
                    "minLength": 2,
                    "maxLength": 100
                    },
        "phone_number": {"type": "string",
                         "minLength": 2,
                         "maxLength": 20,
                         "pattern": r"^\+?[1-9][0-9]{7,14}$"
                         },
        "anydesk": {"type": "string",
                    "minLength": 2,
                    "maxLength": 9
                    },
        "city": {"type": "string",
                 "minLength": 2,
                 "maxLength": 100
                 },
        "default_price": {"type": "number"}
    },
    "required": ["full_name"]
}

client_put_schema = {
    "type": "object",
    "properties": {
        "id": {"type": "string"},
        "full_name": {"type": "string",
                      "minLength": 2,
                      "maxLength": 100
                      },
        "email": {"type": "string",
                  "minLength": 2,
                  "maxLength": 150
                  },
        "discord": {"type": "string",
                    "minLength": 2,
                    "maxLength": 100
                    },
        "phone_number": {"type": "string",
                         "minLength": 2,
                         "maxLength": 20,
                         "pattern": r"^\+?[1-9][0-9]{7,14}$"
                         },
        "anydesk": {"type": "string",
                    "minLength": 2,
                    "maxLength": 9
                    },
        "city": {"type": "string",
                 "minLength": 2,
                 "maxLength": 100
                 },
        "default_price": {"type": "number"}
    },
}


class ReportTotalSchema(ma.Schema):
    class Meta:
        fields = (
            'month', "year", "total_price", "full_date", 'total_tax', 'diff')


report_total_schema = ReportTotalSchema()
reports_total_schema = ReportTotalSchema(many=True)


class ReportClientSchema(ma.Schema):
    class Meta:
        fields = (
            'full_name', "total_price")


report_client_schema = ReportClientSchema()
reports_client_schema = ReportClientSchema(many=True)


class TaxesSchema(ma.Schema):
    class Meta:
        fields = (
            'id', 'date_input_tax', 'zus', 'nfz', 'pit', 'percent')


tax_schema = TaxesSchema()
taxes_schema = TaxesSchema(many=True)

tax_post_schema = {
    "type": "object",
    "properties": {
        "id": {"type": "string"},
        "date_input_tax": {"type": "string"},
        "zus": {"type": "number"},
        "nfz": {"type": "number"},
        "pit": {"type": "number"},
        "percent": {"type": "number"},

    },
}

tax_put_schema = {
    "type": "object",
    "properties": {
        "id": {"type": "string"},
        "date_input_tax": {"type": "string"},
        "zus": {"type": "number"},
        "nfz": {"type": "number"},
        "pit": {"type": "number"},
        "percent": {"type": "number"}

    },
}
