from flask import Flask
from flask_cors import CORS
from blueprints import blueprint

app = Flask(__name__)
app.register_blueprint(blueprint, url_prefix="/api/v1")
CORS(app)
