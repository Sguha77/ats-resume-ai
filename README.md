🧠 ATS Resume Scanner — Smart Resume Analyzer & Enhancer

An intelligent ATS Resume Scanner built with React, Node.js, Express, and MongoDB, powered by AI to help users improve their resumes for better job match scores.

🚀 Live Demo: https://ats-resume-ai.vercel.app

🧩 Backend API: https://ats-resume-backend-jm00.onrender.com

🌟 Features

✅ AI Resume Suggestions

Uses AI to analyze uploaded resumes and give improvement tips.

✅ ATS Score

Compares your resume against job descriptions to calculate match percentage.

✅ PDF Upload & Parsing

Accepts resumes in .pdf format and extracts content for AI processing.

✅ User Authentication

Secure login and registration using JWT authentication.

✅ Pro Resume Generator

Generate a premium, professionally formatted resume instantly.

✅ Dashboard

Users can view, manage, and download their saved resumes.

🏗️ Tech Stack

Frontend

React.js (Vite)

Tailwind CSS

Axios

React Router DOM

Backend

Node.js

Express.js

MongoDB (Mongoose)

JWT Authentication

Multer (for file upload)

OpenAI API (for AI resume insights)

Deployment

Frontend → Vercel

Backend → Render

Database → MongoDB Atlas

⚙️ Installation & Setup (Local)
1️⃣ Clone the Repository
git clone https://github.com/Sguha77/ats-resume-ai.git
cd ats-resume-ai

2️⃣ Setup Backend
cd backend
npm install


Create a .env file inside the backend/ folder:

PORT=3000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key


Run the server:

npm start

3️⃣ Setup Frontend
cd ../frontend
npm install


Create a .env file inside frontend/:

VITE_API_URL=https://ats-resume-backend-jm00.onrender.com


Run the frontend:

npm run dev


Visit:
➡️ Frontend: http://localhost:5173

➡️ Backend: http://localhost:3000

🌐 Deployment
Backend (Render)

Push your code to GitHub.

Create a Web Service on Render.com
.

Set your Build Command → npm install

Set your Start Command → npm start

Add Environment Variables from .env file.

Frontend (Vercel)

Import your repo on Vercel.com
.

Root Directory → frontend

Set Environment Variable:

VITE_API_URL=https://ats-resume-backend-jm00.onrender.com


Deploy 🚀

📂 Folder Structure
ats-resume-ai/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
└── README.md

🧩 API Endpoints
Method	Endpoint	Description	Auth
POST	/api/auth/register	Register new user	❌
POST	/api/auth/login	Login user	❌
POST	/api/resume/ai-suggest	Get AI suggestions	✅
POST	/api/resume/generate-pro	Generate professional resume	✅
GET	/api/resume/list	List all user resumes	✅
GET	/api/resume/download/:id	Download resume	✅
🧠 Future Enhancements

🔍 AI-based Job Description Matching

📊 Resume Analytics Dashboard

🌎 Multi-language Resume Support

📄 Export to Word / Google Docs

💡 Author

S Guha
💼 GitHub

📧 Contact: Available via GitHub

🪪 License

This project is licensed under the MIT License — you’re free to modify and use it for personal or commercial purposes.
