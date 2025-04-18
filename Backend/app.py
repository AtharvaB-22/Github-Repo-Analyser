from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from collections import defaultdict
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()  # take environment variables from .env.
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
HEADERS = {"Authorization": f"token {GITHUB_TOKEN}"} if GITHUB_TOKEN else {}

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
    frequency = request.json.get('frequency', 'day')  # Default to 'day'
    if not url:
        return jsonify({"error": "No URL provided"}), 400
    parts = url.split('/')
    owner, repo = parts[-2], parts[-1]
    
    # Fetch commits from GitHub API
    response = requests.get(f"{GITHUB_API}/repos/{owner}/{repo}/commits")
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch commits"}), 400
    commits = response.json()
    
    # Determine grouping format based on frequency
    if frequency == 'day':
        group_format = '%Y-%m-%d'
    elif frequency == 'week':
        group_format = '%Y-%W'
    elif frequency == 'month':
        group_format = '%Y-%m'
    else:
        return jsonify({"error": "Invalid frequency"}), 400
    
    # Group commits by the specified frequency
    commit_counts = defaultdict(int)
    for commit in commits:
        date_str = commit['commit']['author']['date']
        date = datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%SZ')
        key = date.strftime(group_format)
        commit_counts[key] += 1
    
    return jsonify({"commit_frequency": dict(commit_counts)})
    
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

@app.route('/api/languages', methods=['POST'])
def get_languages():
    url = request.json.get('url')
    if not url:
        return jsonify({"error": "No URL provided"}), 400
    parts = url.split('/')
    owner, repo = parts[-2], parts[-1]
    response = requests.get(f"{GITHUB_API}/repos/{owner}/{repo}/languages")
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch languages"}), 400
    languages = response.json()  # e.g., {"Python": 5000, "JavaScript": 2000}
    total_bytes = sum(languages.values())
    language_percentages = {
        lang: round((count / total_bytes) * 100, 2) if total_bytes > 0 else 0
        for lang, count in languages.items()
    }
    return jsonify({
        "bytes": languages,
        "percentages": language_percentages
    })

@app.route('/api/code_frequency', methods=['POST'])
def get_code_frequency():
    url = request.json.get('url')
    if not url:
        return jsonify({"error": "No URL provided"}), 400
    parts = url.split('/')
    owner, repo = parts[-2], parts[-1]
    response = requests.get(f"{GITHUB_API}/repos/{owner}/{repo}/stats/code_frequency")
    if response.status_code == 202:
        return jsonify({"message": "GitHub is generating statistics. Please try again after a few seconds."}), 202
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch code frequency"}), 400
    code_frequency = response.json()
    if not code_frequency:
        return jsonify({"message": "No code frequency data available yet. Please try again later."}), 204

    # Convert Unix timestamps to human-readable dates
    readable_code_frequency = []
    for week_data in code_frequency:
        week_start = datetime.utcfromtimestamp(week_data[0]).strftime('%Y-%m-%d')
        additions = week_data[1]
        deletions = week_data[2]
        readable_code_frequency.append({
            "Date": week_start,
            "Code Additions": additions,
            "Code Deletions": deletions
        })

    return jsonify(readable_code_frequency)

def fetch_all_prs(owner, repo, state):
    prs = []
    page = 1
    while True:
        url = f"{GITHUB_API}/repos/{owner}/{repo}/pulls?state={state}&per_page=100&page={page}"
        response = requests.get(url, headers=HEADERS)
        if response.status_code != 200:
            print(f"Error: {response.status_code}, {response.text}")  # Debug print
            break
        page_data = response.json()
        if not page_data:
            break
        prs.extend(page_data)
        if len(page_data) < 100:
            break
        page += 1
    return prs

@app.route('/api/pull_requests', methods=['POST'])
def get_pull_requests():
    url = request.json.get('url')
    if not url:
        return jsonify({"error": "No URL provided"}), 400
    parts = url.split('/')
    owner, repo = parts[-2], parts[-1]
    open_prs = fetch_all_prs(owner, repo, "open")
    closed_prs = fetch_all_prs(owner, repo, "closed")
    if open_prs is None or closed_prs is None:
        return jsonify({"error": "Failed to fetch pull requests"}), 400

    merged_count = sum(1 for pr in closed_prs if pr.get("merged_at"))
    closed_unmerged_count = len(closed_prs) - merged_count

    return jsonify({
        "open": len(open_prs),
        "closed_unmerged": closed_unmerged_count,
        "merged": merged_count
    })
    
@app.route('/api/contribution_heatmap', methods=['POST'])
def get_contribution_heatmap():
    url = request.json.get('url')
    if not url:
        return jsonify({"error": "No URL provided"}), 400
    parts = url.split('/')
    owner, repo = parts[-2], parts[-1]
    response = requests.get(f"{GITHUB_API}/repos/{owner}/{repo}/stats/contributors")
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch contribution data"}), 400
    contributors = response.json()
    heatmap_data = {}
    for contributor in contributors:
        for week in contributor['weeks']:
            week_str = datetime.utcfromtimestamp(week['w']).strftime('%Y-%m-%d')
            if week_str not in heatmap_data:
                heatmap_data[week_str] = 0
            heatmap_data[week_str] += week['c']  # Sum commits per week
    return jsonify(heatmap_data)

if __name__ == "__main__":
    app.run(debug=True, port=5000)