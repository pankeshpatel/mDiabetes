import os

from flask import Flask
from flask_cors import CORS

from api.routes import routes
from api.schema import schema

import logging

port = os.getenv("PORT")

app = Flask(__name__)
CORS(app)

app.register_blueprint(routes.get_swaggerui_blueprint(),
                       url_prefix=routes.SWAGGER_URL)
app.register_blueprint(routes.get_routes_blueprint())
app.register_blueprint(schema.get_schema_blueprint())
app.config["UPLOAD_FOLDER"] = os.path.join(os.getcwd(), 'static')
app.config["CONFIG_FOLDER"] = os.path.join(os.getcwd(), 'config')
app.config["LOG_FILE"] = os.path.join(
    os.getcwd(), 'static', 'logs', 'logfile.log')
app.config["CORS-HEADERS"] = "Content-Type"

logging.getLogger("__name__")

if __name__ == "__main__":
    if port is None:
        app.run(host="0.0.0.0", port=8080, debug=True)
    else:
        app.run(host="0.0.0.0", port=int(port), debug=True, threaded=True)
