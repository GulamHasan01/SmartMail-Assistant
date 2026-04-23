# 🚀 SmartMail Assistant

AI-powered email assistant that generates intelligent replies directly inside Gmail using a Chrome Extension, Spring Boot backend, and React frontend.

---

## 🌐 Live Demo

- 🔗 **Frontend (UI):** https://smartmail-assistant.netlify.app/
- ⚙️ **Backend API:** https://smartmail-backend-p35t.onrender.com

---

## ✨ Features

- ✉️ Generate AI-powered email replies instantly
- 🎯 Tone customization (formal, casual, professional)
- ⚡ Fast response (~2–5 seconds)
- 🌐 Works directly inside Gmail (Chrome Extension)
- 🔗 Full-stack integration (Frontend + Backend + Extension)

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Material UI

### Backend
- Spring Boot
- REST APIs
- Groq API (LLM)

### DevOps
- Docker
- Render (Backend Hosting)
- Netlify (Frontend Hosting)

### Extension
- Chrome Extension (Manifest v3)

---

## 📂 Project Structure
SmartMail-Assistant/
├── backend/ # Spring Boot API + Docker
├── frontend/ # React App (Vite)
├── extension/ # Chrome Extension

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

## bash
git clone https://github.com/GulamHasan01/SmartMail-Assistant.git
cd SmartMail-Assistant

## Backend Setup
cd backend
./mvnw clean package -DskipTests
java -jar target/*.jar
## Frontend Setup
cd frontend
npm install
npm run dev
## Chrome Extension Setup
Open Chrome
Go to:
chrome://extensions/
Enable Developer Mode (top right)
Click Load unpacked
Select the extension/ folder
## How to Use
Open Gmail
Click Compose or Reply
Click AI Reply button
Get instant AI-generated response
## Docker Setup (Backend)
cd backend

# Build image
docker build -t smartmail .

# Run container
docker run -p 8080:8080 smartmail
