
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests  # 導入requests模組

app = Flask(__name__)
CORS(app, resources={r"/proxy": {"origins": "http:/localhost:8888"}})  # 允許 http://localhost:8888 的請求

@app.route('/proxy', methods=['POST'])
def proxy():
    url = 'https://script.google.com/macros/s/AKfycbxtWAZdjwGCHtwATmBMEEqQ1lvQrgIWdGhMLZyTW-8xR6oJ_AL7j7uyyO6cksTS15jS/exec'
    data = request.get_json()
    response = requests.post(url, json=data)

    # 修改回應的標頭，加入 "Access-Control-Allow-Origin" header
    response_headers = {
        "Access-Control-Allow-Origin": "http://localhost:8888",
        "Content-Type": "application/json"
    }

    return jsonify(response.json()), 200, response_headers  # 將回應與標頭一同返回


if __name__ == '__main__':
    app.run(host='localhost', port=8888)




