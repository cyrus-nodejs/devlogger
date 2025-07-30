# 🛠️ Developer Workflow Tracker

A full-stack productivity and workflow tracking app for developers. Built with Django REST (API), React (frontend), Chart.js (analytics), and OAuth (Google & GitHub login). Perfect for monitoring code activity, time management, and project goals.

---

## 📦 Tech Stack

- 🔙 **Backend**: Django + Django REST Framework  
- 🔛 **Frontend**: React + Axios  
- 📊 **Charts**: Chart.js  
- 🔐 **Authentication**: Google OAuth2 + GitHub OAuth  
- 🗃️ **Database**: PostgreSQL (default), can be configured

---

## ⚙️ Features

- 🔐 Secure OAuth2 login (Google & GitHub)
- ✅ Daily task tracking and completion stats
- 🧠 Goal-setting and productivity dashboard
- 📈 Visualizations with Chart.js (time usage, task breakdown, commit frequency)
- 🔄 GitHub API integration to sync commits and PRs
- 🗓️ Weekly summary report

---

## 🛠️ Setup & Installation

### 1. Clone the repo

```bash
git clone https://github.com/cyrus-nodejs/devlogger.git
cd devlogger

```


cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Add your OAuth credentials and DB config

python manage.py migrate
python manage.py runserver

 Frontend Setup (React)
cd client
npm install
npm start

DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1

# OAuth credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# GitHub token for API access
GITHUB_API_TOKEN=your_github_token

# Database
DATABASE_URL=postgres://user:password@localhost:5432/yourdb

REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_GITHUB_CLIENT_ID=your_github_client_id

🚀 Usage
Visit http://localhost:3000 to access the frontend.

Login via Google or GitHub OAuth.

Add tasks, track time, and view productivity analytics.

📊 Charts & Analytics
Tasks Completed per Day

Time Spent per Task

GitHub Commit Activity

Weekly Productivity Summary

All visualized using Chart.js.

🧩 API Endpoints
Method	Endpoint	Description
GET	/api/sessions/	List all tasks
POST	/api/sessions/	Create a new task

GET	/api/github-activity/	Weekly summary data

# Fork and clone
git checkout -b feature/your-feature
git commit -m "Add your feature"
git push origin feature/your-feature

