from flask import Blueprint, make_response, jsonify, request
from client import client

blueprint = Blueprint("blueprint", __name__)

@blueprint.route("/<string:key>", methods=["GET"]) 
def get_value(key):
    if request.method == "GET":
        value = client.get(key)
        if value is not None:
            return make_response(jsonify({
                "value": value.decode("utf-8") 
                }), 200)
        else:
            return make_response(jsonify({
                "code": 404,
                "message": f"The key {key} was not found maybe it has expired."
            }), 404)
    else:
        return make_response(jsonify({
            "code": 400,
            "message": "Only Get Methods"
        }))

@blueprint.route('/update', methods=["PUT", "PATCH"]) 
def update_key():
    if request.method == "PUT" or request.method == "PATCH":
        if request.is_json:
            res = request.get_json()
            key = res.get("key")
            value = client.get(key)
            if value is None:
                return make_response(jsonify({
                    "code": 404,
                    "message": f"The key {key} was not found maybe it has expired."
                }), 404)
            
            if res.get("expiresIn"):
                client.setex(key,res.get("expiresIn"), res.get("value"))
                return make_response(jsonify({
                    "code": 200,
                    "data": res
                }))
            else:
                client.set(key, res.get("value") )
                return make_response(jsonify({
                    "code": 200,
                    "data": res
                }))
        else:
            return  make_response(jsonify({
                "code": 500,
                "message": "Only json data is required."
            }), 500)
    else:
        return make_response(jsonify({
            "code": 400,
            "message": "Only Get Methods"
        }))

@blueprint.route('/delete', methods=["DELETE"]) 
def delete_key():
    if request.method == "DELETE":
        if request.is_json:
            res = request.get_json()
            key = res.get("key")
            value = client.get(key)
            if value is not None:
                client.delete(key)
                return make_response(jsonify({
                    key: "deleted" 
                    }), 200)
            else:
                return make_response(jsonify({
                    "code": 404,
                    "message": f"The key {key} was not found maybe it has expired."
                }), 404)
        else:
            return  make_response(jsonify({
                "code": 500,
                "message": "Only json data is required."
            }), 500)
    else:
        return make_response(jsonify({
            "code": 400,
            "message": "Only Get Methods"
        }))


@blueprint.route('/add-key', methods=["POST"]) 
def add_key():
    if request.method == "POST":
        if request.is_json:
            res = request.get_json()
            if res.get("expiresIn"):
                client.setex(res.get('key'),res.get("expiresIn"), res.get("value"))
                return make_response(jsonify({
                    "code": 200,
                    "data": res
                }))
            else:
                client.set(res.get('key'), res.get("value") )
                return make_response(jsonify({
                    "code": 200,
                    "data": res
                }))
        else:
            return  make_response(jsonify({
                "code": 500,
                "message": "Only json data is required."
            }), 500)
    else:
        return make_response(jsonify({
            "code": 400,
            "message": "Only Get Methods"
        }))