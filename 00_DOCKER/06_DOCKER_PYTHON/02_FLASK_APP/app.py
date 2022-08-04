from app import app
from flask import make_response, jsonify

class AppConfig:
    PORT = 3001
    DEBUG = False
    HOST = '0.0.0.0'
    
@app.route('/', methods=["GET"])
def meta():
    meta ={
        "programmer": "@crispengari",
        "main": "Flask, Docker and Redis",
        "description": "A simple flask application with Docker.",
        "language": "python",
        "libraries": ["redis"],
    }
    return make_response(jsonify(meta)), 200

if __name__ == "__main__":
    app.run(debug=AppConfig().DEBUG, port=AppConfig().PORT, host=AppConfig().HOST)