import os
import re
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
	newtable['rows'] = json.loads(df.to_json(orient='records'))
	data['tables'].append(newtable)
	json_obj = json.dumps(data)
	return json_obj

@app.route('/')
@app.route('/index')
def index():
	return render_template('map-display.html')

@app.route('/get_data', methods=['POST'])
def get_data():
	input_data = {}
	try:
		input_data['groups'] = request.form.getlist['groups-checkbox']
		input_data['where-first'] = request.form.getlist['where-checkbox-first']
		input_data['where-comparison'] = request.form.getlist['where-checkbox-comparison']
		input_data['where-second'] = request.form.getlist['where-checkbox-second']
	except Exception as e:
		print(e) # for debugging purposes
		return jsonify({'Error': 'Could not fetch input in field ??.'})
	conn = sqlite3.connect('app/data.db')
	cur = conn.cursor()
	col_names = set([x[0] for x in cur.execute('SELECT * FROM datatable LIMIT 1;').description])
	query_select = 'SELECT !, !, !, ! FROM datatable'
	if 'where' in input_data and input_data['where'] != []:
		query_select += ' WHERE'
		input_data['where'][0]
	if 'groups' in input_data and input_data['groups'] != []:
		query_select += '\nGROUP BY '
		for i in range(len(input_data['groups'])-1):
			if input_data['groups'][i] not in col_names:
				return jsonify({'Error': 'Column name {} is invalid'.format(input_data['groups'][i])})
			query_select += input_data['groups'] + ', '
		query_select += input_data['groups'][-1] + ';'
	cur.execute()
	print(input_data)

@app.route('/get_map_data/', methods=['POST'])
def get_map_data():
	conn = sqlite3.connect('app/testdata.db')
	query = 'SELECT * FROM testtable;'
	json_obj = get_query_as_json(conn, query)
	return json_obj, 200
