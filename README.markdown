# GitHub Repo Analyzer

Welcome to the **GitHub Repo Analyzer**, a powerful tool designed to analyze and visualize data from GitHub repositories. This project combines a Flask backend with a React frontend, all neatly packaged in Docker containers for easy setup and deployment. Whether you're a developer, a data enthusiast, or just curious about a repository's stats, this tool provides a detailed breakdown of repository metadata, commit activity, contributor stats, and more—all through an intuitive web interface.

## Project Overview

The GitHub Repo Analyzer fetches data from the GitHub API and presents it in a user-friendly way. It’s perfect for:

- Exploring repository details like stars, forks, and watchers.
- Analyzing commit patterns over time.
- Understanding who’s contributing and how much.
- Visualizing code changes and pull request activity.

The backend handles API requests and data processing, while the frontend offers an interactive UI to explore the data. Docker ensures everything runs smoothly without dependency hassles.

## Features

Here’s what you can do with the GitHub Repo Analyzer:

- **Repository Metadata**: Get the basics—repository name, star count, fork count, and watchers.
- **Commit Frequency**: See how often commits happen, grouped by day, week, or month.
- **Contributor Analysis**: Discover who’s contributing and how many commits they’ve made.
- **Language Breakdown**: View a percentage breakdown of the programming languages used in the repo.
- **Code Frequency**: Visualize weekly additions and deletions to the codebase.
- **Pull Request Stats**: Track open, closed (unmerged), and merged pull requests.
- **Contribution Heatmap**: Check out a daily commit activity heatmap.

## Prerequisites

Before you dive in, make sure you have these essentials:

- **Docker**: You’ll need Docker to run the project in containers. Download and install it from the official Docker site.
- **GitHub Personal Access Token**: The GitHub API has rate limits (60 requests/hour unauthenticated, 5000/hour authenticated). To keep things running smoothly, you’ll need a token.
  - **How to Get a Token**:
    1. Go to GitHub Settings &gt; Developer settings &gt; Personal access tokens.
    2. Click "Generate new token" (classic).
    3. Give it a name, select the `repo` scope, and generate it.
    4. Copy the token—it’s a long string like `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.
  - You’ll use this token in a `.env` file (more on that below).

## Setup Instructions

Let’s get this project up and running! Follow these steps carefully.

### Step 1: Clone the Repository

First, grab the code from GitHub:

```bash
git clone https://github.com/your-username/GitHub-Repo-Analyser.git
cd GitHub-Repo-Analyser
```

Replace `your-username` with your GitHub username or the actual repo owner’s username.

### Step 2: Create the `.env` File

The project needs your GitHub token to talk to the API. Create a file named `.env` in the project root (the `GitHub-Repo-Analyser` directory) and add your token:

```
GITHUB_TOKEN=your_personal_access_token_here
```

- Replace `your_personal_access_token_here` with the token you generated.
- **Security Tip**: Don’t share this file publicly! Add `.env` to your `.gitignore` to keep it out of version control.

### Step 3: Build and Run with Docker

Docker makes setup a breeze. From the project root, run:

```bash
docker-compose up --build
```

- This builds the backend (Flask) and frontend (React) images and starts the containers.
- The first time might take a few minutes to download dependencies and build everything.

### Step 4: Access the Application

Once the containers are running:

- **Frontend**: Open your browser and go to `http://localhost:3000`. Enter a repo URL (e.g., `https://github.com/facebook/react`) and explore!
- **Backend API**: The API runs at `http://localhost:5000`. You can test endpoints manually if you’d like (see API Endpoints below).

### Step 5: Stop the Containers

When you’re done, stop everything with:

```bash
docker-compose down
```

This shuts down the containers but keeps your data intact for the next run.

## Running Locally (Without Docker)

Prefer to run it without Docker? You’ll need to set up the backend and frontend separately. A virtual environment is **required** for the backend to manage Python dependencies properly—without it, `pip install` might mess up your system Python.

### Backend Setup

1. **Navigate to the Backend Directory**:

   ```bash
   cd backend
   ```

2. **Create a Virtual Environment**:

   ```bash
   python3 -m venv venv
   ```

   - This creates a folder called `venv` with an isolated Python environment.

3. **Activate the Virtual Environment**:

   - On macOS/Linux:

     ```bash
     source venv/bin/activate
     ```

   - On Windows:

     ```bash
     venv\Scripts\activate
     ```

   - Your terminal prompt should change (e.g., `(venv)`), showing the environment is active.

4. **Install Dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

   - This installs Flask, requests, and other Python libraries listed in `requirements.txt`. The virtual environment ensures these don’t conflict with your system’s Python packages.

5. **Copy the** `.env` **File**:

   - If you created `.env` in the root directory, copy it to the `backend` folder:

     ```bash
     cp ../.env .
     ```

6. **Run the Flask Server**:

   ```bash
   python app.py
   ```

   - The backend will start at `http://localhost:5000`.

### Frontend Setup

1. **Navigate to the Frontend Directory**:

   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

   - This fetches React and other JavaScript libraries.

3. **Run the Development Server**:

   ```bash
   npm run dev
   ```

   - The frontend will start at `http://localhost:3000` and connect to the backend at `http://localhost:5000`.

### Notes for Local Running

- Make sure the `.env` file is in the `backend` directory for the Flask app to read the `GITHUB_TOKEN`.
- If the frontend can’t reach the backend, check `apiServices.ts` and ensure `API_ENDPOINT` is set to `http://localhost:5000/api`.

## API Endpoints

The backend serves these endpoints (all expect a POST request with a JSON body like `{"url": "https://github.com/facebook/react"}`):

- `POST /api/validate_repo`: Checks if the repo URL is valid and public.
- `POST /api/repo`: Returns basic repo info (name, stars, forks, watchers).
- `POST /api/commits`: Provides commit frequency data (daily, weekly, or monthly).
- `POST /api/contributors`: Lists contributors and their commit counts.
- `POST /api/languages`: Shows language usage by bytes and percentage.
- `POST /api/code_frequency`: Returns weekly code additions and deletions.
- `POST /api/pull_requests`: Gives pull request stats (open, closed, merged).
- `POST /api/contribution_heatmap`: Supplies daily commit data for a heatmap.

Try them with a tool like Postman or curl!

## Troubleshooting

- **Rate Limit Errors**: Seeing "API rate limit exceeded"? Double-check that `GITHUB_TOKEN` is in your `.env` file and has the `repo` scope.
- **Dependency Issues**: If `pip install` fails outside a virtual environment, use the virtual environment steps above to isolate dependencies.
- **Docker Problems**: Ensure Docker is running and you have permissions to create containers.
- **Local Frontend Errors**: If the UI doesn’t load data, verify the backend is running and the API endpoint is correct.

## Contributing

Love the project? Want to make it better? Here’s how to contribute:

1. Fork the repo and clone it.
2. Set up your `.env` file with a valid GitHub token.
3. Make your changes (test locally or with Docker).
4. Submit a pull request with a clear description of what you’ve done.

Stick to the existing code style for consistency, and test thoroughly!

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

Happy analyzing! If you have questions or run into issues, feel free to open an issue on the repo. Enjoy exploring GitHub data like never before!