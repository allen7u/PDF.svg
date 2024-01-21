













from importlib.resources import path
import json
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, send_from_directory, send_file
import os
import re
from jinja2 import Template
from icecream import ic
from objprint import op
import urllib
import argparse

parser = argparse.ArgumentParser(description='Process some integers.')
parser.add_argument('--port', type=int, default=5000, help='port to run on')
parser.add_argument('--debug', type=bool, default=False, help='debug mode')
parser.add_argument('root', nargs='?', help='host to run on')
args = parser.parse_args()

if args.root == '.':
    print('root', args.root)
    # get absolute path of current directory
    print(os.path.abspath(os.getcwd()))
    path_list = [os.path.abspath(os.getcwd())]
elif args.root == None:
    path_list =[
            "H:\Video - 字幕转PDF；SRT，",
            'F:\Anaconda_使用\字幕转PDF；SRT，',
            "F:\Anaconda_Play\Page Hub Server - Flask\pdf"
        ]
else:
    print('root', args.root)
    path_list = [ args.root ]

# print('CWD: ')
# print(os.getcwd())
# os.chdir(os.path.dirname(os.path.abspath(__file__)))
# print('CWD now: ')
# print(os.getcwd())

app = Flask(__name__)

# suuport utf8 encoding for Chinese
app.config['JSON_AS_ASCII'] = False

# the omni entry
@app.route('/', methods=['GET'])
def render_pdf_list():
    # to test URL arguments passing
    if request.args.get('q'):
        print(request.args.get('q'))
    # return the pdf file to extract with from viewer_URL_template.html
    elif request.args.get('get_file'):
        path = request.args.get('get_file')
        ic(path)
        if os.path.isfile(path):
            return send_file(path)
    # to render the viewer_URL_template.html template
    elif request.args.get('pdf_file_path'):
        pdf_file_path = request.args.get('pdf_file_path')
        ic()
        ic('plain',pdf_file_path)
        pdf_file_name = os.path.split(pdf_file_path)[1].strip('.pdf')
        pdf_file_path = urllib.parse.quote_plus(pdf_file_path)
        ic('quote',pdf_file_path)
        return render_template('viewer_URL_template.html', pdf_url=pdf_file_path, pdf_file_name=pdf_file_name)
    
    # to return cached mutual enrichment json
    # not working yet, so $getJSON was used in browser which handle file openning job
    elif request.args.get('get_json'):
        file_name = request.args.get('get_json')
        ic(file_name)
        path = f'static/json/{file_name}.json'
        if os.path.isfile(path):
            with open(path, 'r', encoding='utf-8') as f:
                print(f.read())
                print(type(f.read()))
                pass
                return jsonify(json.loads(f.read()))
        else:
            print('No such json file yet')

    # otherwise, return a list of pdf files to choose
    else:
        file_path_list = []

        def walk(path):
            for root, dirs, files in os.walk(path):
                for file in files:
                    file_path = os.path.join(root, file)
                    file_path_list.append(file_path)
                    # print(file_path)
                for dir in dirs:
                    walk(os.path.join(root, dir))

        for path in path_list:
            walk(path)

        print(file_path_list)

        # filter for pdf file
        pdf_file_path_list = []
        for file_path in file_path_list:
            if file_path.endswith('.pdf'):
                pdf_file_path_list.append(file_path)
        # so it can be safed passed in again as url arguments
        pdf_file_path_list_quote = [ urllib.parse.quote_plus(file_name) for file_name in pdf_file_path_list ]
        # as the text content of the <a> tag needs not to be escaped
        pdf_file_path_list_and_quote_list = list(zip(pdf_file_path_list, pdf_file_path_list_quote))
        
        return render_template('index_of_pdf_files.html',pdf_file_path_list_and_quote_list = pdf_file_path_list_and_quote_list)

# serve static files
@app.route('/<path:path>')
def send_static(path):
    # ic()
    print(path)
    return send_from_directory('static', path)

# handle cors issue
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# cache by saving mutual enrichment result from browser
# post as form to carry along pdf file name info
@app.route('/', methods=['POST'])
def post_json():
    data = request.get_json()  # Get data sent as JSON
    pdf_file_name = data.get('pdf_file_name')
    diagonal_kw_sum = data.get('diagonal_kw_sum')
    print(pdf_file_name + '.json POSTed')
    dir_ = os.path.dirname(os.path.abspath(__file__))
    print(dir_)
    with open(f'{dir_}/static/json/{pdf_file_name}.json','w',encoding = 'utf-8' ) as f:
        diagonal_kw_sum_json = json.dumps(diagonal_kw_sum, ensure_ascii=False)
        f.write(diagonal_kw_sum_json)
    return diagonal_kw_sum_json  # Use jsonify to return JSON

if __name__ == '__main__':
    # run at ip
    app.run(host='0.0.0.0', debug=True)
    # app.run(debug=True)






if False:

    # render index.html
    @app.route('/index.html')
    def index():
        return render_template('index.html')
        # return render_template('__Input_File.html')
        # return render_template('viewer_URL.html')

    # serve the file
    @app.route('/get_file/<path:path>')
    def send_the_file(path):
        ic(send_the_file)
        ic(path)
        if os.path.isfile(path):
            return send_file(path)
        return '404 : os.path.isfile(path) == false'

    # recursively list files on server
    @app.route('/list')
    def recursively_list_files_on_the_server():
        return jsonify(os.listdir(os.getcwd()))
        # files = os.listdir('./')
        # return jsonify(files)

    pdf_dir_path = 'F:\Anaconda_使用\字幕转PDF；SRT，'
    file_path_list = []
    def walk(path):
        for root, dirs, files in os.walk(path):
            for file in files:
                file_path = os.path.join(root, file)
                file_path_list.append(file_path)
                # print(file_path)
            for dir in dirs:
                walk(os.path.join(root, dir))
    walk(pdf_dir_path)
    # print(file_path_list)

    @app.route('/walk')
    def walk_files_on_the_server():
        walk(pdf_dir_path)
        return jsonify(file_path_list)

    @app.route("/pdf")
    def home():
        return render_template("index.html", file_path_list = file_path_list )

    # return menu to pick pdf for pdf_svg view
    @app.route("/pdf2")
    def home2():
        return render_template("index_pdf_svg.html", file_path_list = file_path_list )

    # return viewr_URL_template.html on pdf_svg
    current_pdf_file_base_dir_path = ''
    @app.route('/pdf_svg/<path:path>')
    def pdf_svg(path):
        if path.endswith('.pdf'):
            current_pdf_file_base_dir_path = path
            # match until the last '/'
            current_pdf_file_base_dir_path = re.sub(r'(.*)/.*', r'\1', current_pdf_file_base_dir_path)
            print(current_pdf_file_base_dir_path)
            with open('tmp.txt','w') as f:
                f.write(current_pdf_file_base_dir_path)
            pass
            return render_template('viewer_URL_template.html', pdf_url = path)
        else: # to avoid url path built-up
            with open('tmp.txt','r') as f:
                current_pdf_file_base_dir_path = f.read()
                print(current_pdf_file_base_dir_path)
            effective_path = path.split(current_pdf_file_base_dir_path)[-1]
            print(effective_path)
            pass
            return send_static(effective_path)

    # render jinja2 template based on file_path_list
    @app.route('/jinja2')
    def render_jinja2_template():
        with open('templates/index.html', 'r', encoding='utf-8') as f:
            template = Template(f.read())
        # print(template.render( file_path_list = file_path_list ))
        return template.render( file_path_list = file_path_list )

# @app.route('/<var_1>/<var_2>/<var3>/')
# def show_file(var_1, var_2, var3):
#     print(var_1, var_2, var3)
#     return 'fancy'

# return render_template("control.html", title="Jinja and Flask")
# return render_template("control.html", title=["Jinja"," and Flask"])
# return render_template("control.html", title=file_path_list)

