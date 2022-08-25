













from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, send_from_directory



app = Flask(__name__)

# suuport utf8 encoding for Chinese
app.config['JSON_AS_ASCII'] = False

# handle cors issue
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# handle json POST
@app.route('/', methods=['POST'])
def post_json():
    content = request.get_json()
    print(content)
    return jsonify(content)

# render index.html
@app.route('/index.html')
def index():
    return render_template('index.html')
    # return render_template('__Input_File.html')
    # return render_template('viewer_URL.html')

# serve static files
@app.route('/<path:path>')
def static_file(path):
    print(path)
    return app.send_static_file(path)


if __name__ == '__main__':
    app.run(debug=True)