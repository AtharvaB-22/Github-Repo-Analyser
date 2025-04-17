from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access
GITHUB_API = "https://api.github.com"

@app.route('/api/repo', methods=['POST'])
def get_repo_data():
    url = request.json.get('url')
    if not url:
        return jsonify({"error": "No URL provided"}), 400
    parts = url.split('/')
    owner, repo = parts[-2], parts[-1]
    response = requests.get(f"{GITHUB_API}/repos/{owner}/{repo}")
    if response.status_code != 200:
        return jsonify({"error": "Invalid repo or API limit reached"}), 400
    data = response.json()
    repo_info = {
        "name": data["name"],
        "stars": data["stargazers_count"],
        "forks": data["forks_count"],
        "watchers": data["watchers_count"]
    }
    return jsonify(repo_info)

@app.route('/api/commits', methods=['POST'])
def get_commits():
    url = request.json.get('url')
    parts = url.split('/')
    owner, repo = parts[-2], parts[-1]
    response = requests.get(f"{GITHUB_API}/repos/{owner}/{repo}/commits")
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch commits"}), 400
    commits = response.json()
    return jsonify({"total_commits": len(commits)})

@app.route('/api/contributors', methods=['POST'])
def get_contributors():
    url = request.json.get('url')
    parts = url.split('/')
    owner, repo = parts[-2], parts[-1]
    response = requests.get(f"{GITHUB_API}/repos/{owner}/{repo}/contributors")
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch contributors"}), 400
    data = response.json()
    contributors = [{"login": c["login"], "commits": c["contributions"]} for c in data]
    return jsonify(contributors)

if __name__ == "__main__":
    app.run(debug=True, port=5000)