# SmartCitizen AI

SmartCitizen AI is a full-stack web application developed to simplify the process of reporting and tracking civic issues. The platform enables citizens to report problems such as potholes, garbage accumulation, water leakage, streetlight failures, fire incidents, sewage issues, and other public infrastructure concerns through a clean and user-friendly interface.

The application integrates Google Gemini AI to assist users with civic-related queries and guidance. Every complaint submitted through the platform is assigned a unique tracking ID, allowing users to monitor the status of their report at any time. The project is designed with a responsive frontend, a RESTful backend, and a cloud-hosted database to provide a complete end-to-end solution.

---

## Features

- AI-powered assistant using Google Gemini API
- Report civic issues with detailed descriptions
- Image upload support for complaints
- Automatic tracking ID generation
- Track complaint status using tracking ID
- MongoDB-based complaint management
- Responsive and modern user interface
- REST API integration between frontend and backend
- GitHub Pages and Render deployment

---

## Technology Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Multer

### AI Integration
- Google Gemini API

### Deployment
- Frontend: GitHub Pages
- Backend: Render

---

## Project Structure

```text
SmartCitizen-AI/
│
├── .github/
│   └── workflows/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── package.json
├── vite.config.js
└── README.md
```

---

## Installation

Clone the repository

```bash
git clone https://github.com/sejalnama7/SmartCitizen-AI.git
```

Navigate to the project

```bash
cd SmartCitizen-AI
```

Install frontend dependencies

```bash
npm install
```

Install backend dependencies

```bash
cd server
npm install
```

---

## Environment Variables

### Frontend (.env)

```env
VITE_API_URL=https://your-backend-url/api
```

### Backend (.env)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=https://your-frontend-url
GEMINI_API_KEY=your_gemini_api_key
```

---

## Running the Application

Start the frontend

```bash
npm run dev
```

Start the backend

```bash
cd server
npm run dev
```

---

## Live Demo

Frontend

https://sejalnama7.github.io/SmartCitizen-AI/

Backend

https://smartcitizen-ai.onrender.com

---

## Application Modules

### Home

The landing page introduces the SmartCitizen AI platform and provides quick navigation to all major functionalities. It highlights the purpose of the application and showcases different categories of civic issues.

### AI Assistant

The AI Assistant is powered by Google Gemini API and provides users with instant guidance regarding civic issues, reporting procedures, and general assistance through conversational responses.

### Report Issue

Users can submit complaints by selecting an issue category, entering a description, specifying the location, and uploading an image if required. After successful submission, the system generates a unique tracking ID.

### Track Issue

Users can track previously submitted complaints by entering the generated tracking ID. The system retrieves and displays the latest complaint details and current status.

---

## Future Improvements

- User Authentication
- Admin Dashboard
- Email Notifications
- Maps Integration
- Complaint Analytics
- Multi-language Support
- Role-based Access Control

---

## Author

**Sejal Nama**

BCA Student | Aspiring Full Stack Developer

GitHub: https://github.com/sejalnama7

---
