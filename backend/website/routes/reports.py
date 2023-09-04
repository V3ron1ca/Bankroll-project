import json

from flask import jsonify
from flask_restful_swagger_3 import Resource
from sqlalchemy import column, text
from datetime import datetime
from ..schemas import reports_total_schema, reports_client_schema

from website import db

reports_total_query = """
select _income.month, _income.year, _income.total_price, _income.full_date, _taxes.total_tax, _income.total_price -_taxes.total_tax as diff from
(SELECT EXTRACT(MONTH FROM date_of_work) as month, EXTRACT(YEAR FROM date_of_work)  as year, SUM(price) 
as total_price, CONCAT(EXTRACT(YEAR FROM date_of_work), '-', EXTRACT(MONTH FROM date_of_work)) as 
full_date FROM service GROUP BY EXTRACT(MONTH FROM date_of_work), EXTRACT(YEAR FROM 
date_of_work)) as _income
left join
(select EXTRACT(MONTH FROM date_input_tax) as month, EXTRACT(YEAR FROM date_input_tax)  as year, SUM(zus+nfz+pit) as total_tax from taxes
GROUP BY EXTRACT(MONTH FROM date_input_tax), EXTRACT(YEAR FROM date_input_tax)) as _taxes
on _taxes.month=_income.month and _taxes.year=_income.year;
"""
class ReportsTotalApi(Resource):
    def get(self):
        reports = db.session.query(column("month"), column("year"),
                                   column("total_price"), column("full_date"),
                                   column("total_tax"), column("diff")).from_statement(text(reports_total_query)).all()
        return jsonify(reports_total_schema.dump(reports))


class ReportsClientsTotalApi(Resource):
    def get(self):
        clients = db.session.query(column("full_name"), column("total_price")).from_statement(text(
            "SELECT client.full_name, SUM(service.price) as total_price FROM client INNER JOIN service ON "
            "client.id = service.client_id"
            " GROUP BY client.full_name "
            "ORDER BY total_price DESC")).all()
        return jsonify(reports_client_schema.dump(clients))


class ReportsClientsMonthApi(Resource):
    def get(self, date):
        date = datetime.strptime(date, "%Y-%m")
        values = {"month": date.month, "year": date.year}
        query = db.session.query(column("full_name"), column("total_price")).from_statement(text(
            "SELECT client.full_name, SUM(service.price) as total_price FROM client "
            "INNER JOIN service ON client.id = service.client_id "
            "WHERE EXTRACT(YEAR FROM date_of_work)= :year AND EXTRACT(MONTH FROM date_of_work)= :month "
            "GROUP BY client.full_name"))
        clients = db.session.execute(query, values).all()
        return jsonify(reports_client_schema.dump(clients))
