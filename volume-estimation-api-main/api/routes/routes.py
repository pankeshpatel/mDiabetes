import json
import logging
import os
import random
import time
from time import sleep
from datetime import datetime
import uuid

from flask import request, Blueprint, jsonify, Response, send_from_directory
from flask import current_app as app
from flask_swagger_ui import get_swaggerui_blueprint
from flask_cors import cross_origin
from marshmallow import ValidationError
from werkzeug.utils import secure_filename

from api.schema import schema
from scripts.script import find_size

app_schema = schema.AppSchema()

REQUEST_API = Blueprint('routes', __name__)

SWAGGER_URL = ''
API_URL = '/swagger/swagger.json'
swagger_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        "app_name": "Food detection API",
        "validatorUrl": None
    }
)


@REQUEST_API.route('/swagger/<path:path>')
def get_swaggerui(path):
    return send_from_directory('swagger', path)


LOG_FILE = os.path.join(os.getcwd(), "static", "logs", "logfile.log")


def upload(request, image_name=None, image_key=None):
    if request.files:
        if image_key not in request.files:
            raise ValidationError(f"{image_key} paramenter missing")
        f = request.files[image_key]
        filepath = app.config["UPLOAD_FOLDER"]
        if not os.path.isdir(filepath):
            os.makedirs(filepath)
        filename = os.path.join(filepath, secure_filename(
            image_name+".jpg"))
        f.save(filename)
        return filename
    else:
        raise Exception("No file uploaded")


def get_routes_blueprint():
    return REQUEST_API


def get_swaggerui_blueprint():
    return swagger_blueprint


@REQUEST_API.route('/api1', methods=["POST", "GET"])
@cross_origin()
def api1():
    try:
        uid = uuid.uuid4().hex
        data = request.form.to_dict()
        # app_schema.load(data)
        result = None
        # print(data)
        top_view_path = None
        side_view_path = None
        if request.files:
            top_view_path = upload(
                request, image_key="top_view_path", image_name=f"top_view_{uid}.jpg")
            if not os.path.isfile(top_view_path):
                raise Exception("file upload not successfull")
            result = find_size(top_view_path, uid)
        elif data['top_view_url']:
            top_view_url = data['top_view_url']
            result = find_size(top_view_url, uid)
        else:
            return jsonify(error="No file url or file upload found for top view image", success=False, status_code=500)
        try:
            if request.files:
                side_view_path = upload(
                    request, image_key="side_view_path", image_name=f"side_view_{uid}.jpg")
                if not os.path.isfile(side_view_path):
                    raise Exception("file upload not successfull")
            elif data['side_view_url']:
                side_view_url = data['side_view_url']
            else:
                pass
        except:
            pass
            # return jsonify(error="No file url or file uploaded for side view image", success=False, status_code=500)

        # result = find_size(top_view_path)
        colors, download = result
        print(request.form.get('food'))
        foodItems = tuple(json.loads(request.form.get('food')).keys())
        return jsonify(colors=colors, download=download, foodItems=foodItems, success=True, status_code=200)

    except Exception as e:
        print("Error occured:", e)
        return jsonify(error="Error occured", success=False, status_code=500)


@REQUEST_API.route('/download/<path:filename>', methods=["POST", "GET"])
@cross_origin()
def download(filename):
    try:
        path = filename.split('.')
        if path[-1] != 'jpg':
            raise ValidationError("Only jpg files allowed to download")
        return send_from_directory('static', filename, as_attachment=False)
    except FileNotFoundError as e:
        print(e)
        return jsonify(success=False, status_code=500, error="file not found")
    except ValidationError as e:
        return jsonify(success=False, status_code=500, error=e.messages)
    except Exception as e:
        print(e)
        return jsonify(success=False, status_code=500, error="error occured while downloading")


@REQUEST_API.route('/api2', methods=["POST", "GET"])
@cross_origin()
def api2():
    try:
        foodCarbMap = {}
        if 'foodColorMap' not in request.form.to_dict():
            return jsonify(success=False, status_code=500, error="foodColorMap not found in request")
        foodColorMap = json.loads(request.form.get('foodColorMap'))
        for food in foodColorMap:
            foodCarbMap[food] = random.randint(100, 500)
        return jsonify(foodCarbMap=foodCarbMap, success=True, status_code=200)
    except Exception as e:
        print(e)
        return jsonify(error="Error occured", success=False, status_code=500)


@REQUEST_API.route('/api3', methods=["POST", "GET"])
@cross_origin()
def api3():
    try:
        foodCarbMap = {}
        data = request.form.to_dict()
        if 'foodWithQuantity' not in data:
            return jsonify(success=False, status_code=500, error="foodWithQuantity not found in request")
        elif 'packagedFood' not in data:
            return jsonify(success=False, status_code=500, error="packagedFood not found in request")
        foodWithQuantity = data["foodWithQuantity"].split(',')
        for food in foodWithQuantity:
            foodCarbMap[food] = random.randint(100, 500)

        packagedFood = json.loads(data["packagedFood"])
        for food in packagedFood:
            foodCarbMap[food] = random.randint(100, 500)

        return jsonify(foodCarbMap=foodCarbMap, success=True, status_code=200)
    except Exception as e:
        print(e)
        return jsonify(error="Error occured", success=False, status_code=500)
