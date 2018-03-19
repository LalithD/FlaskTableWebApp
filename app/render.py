import os
import sqlite3
from flask import jsonify
from flask import render_template
from flask import request
from app import app

import json
import pandas as pd

def get_query_as_json(conn, query, input_params=None):
	df = pd.read_sql_query(query, conn, params=input_params)
	data = {}
	data['tables'] = []
	newtable = {}
	newtable['name'] = 'firsttable'
	newtable['column_names'] = ['Row #'] + list(df.columns)
	newtable['rows'] = json.loads(df.to_json(orient='table'))['data']
	data['tables'].append(newtable)
	json_obj = json.dumps(data)
	return json_obj

@app.route('/')
@app.route('/index')
def index():
	conn = sqlite3.connect('app/mushrooms.db')
	query = 'SELECT class, odor, bruises, population, habitat FROM mushrooms LIMIT 100;'
	json_obj = get_query_as_json(conn, query)
	return render_template('table-design.html', data=json.loads(json_obj))
