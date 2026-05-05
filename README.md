# 🧠 Mitra - AI Mental Health Companion

<div align="center">

![Mitra Banner](https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80)

**A compassionate AI companion for your mental wellness journey**

[![React](https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)

</div>

---

## ✨ About Mitra

Mitra is a deeply compassionate AI mental health companion that makes you feel truly heard, understood, and less alone. Unlike generic chatbots, Mitra responds like a warm, caring best friend — leading with empathy first, never with judgment.

> *"Your feelings are valid. Your struggles are real. You matter."*

---

## 🌟 Features

### 🤖 AI Companion Chat
- Real-time mood detection from your messages
- Deeply empathetic, human-like responses
- Powered by Google Gemini AI
- Supports both Tamil & English

### 📔 Journal
- Write your daily thoughts and feelings
- Mood-tagged entries
- Beautiful card-based UI
- Full CRUD operations

### 📊 Progress Tracking
- Mood history visualization
- Interactive line charts
- Mood score analytics
- Recent mood timeline

### 🌬️ Breathing Exercises
- Box Breathing (4-4-4-4)
- 4-7-8 Breathing technique
- Deep Breathing
- Animated breathing circle

### 🔐 Authentication
- Secure JWT-based auth
- 7-day session persistence
- Password encryption with bcrypt

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js 18 |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB Atlas |
| **AI** | Google Gemini API |
| **Auth** | JWT + bcryptjs |
| **Charts** | Recharts |
| **Fonts** | Cormorant Garamond + DM Sans |
| **Hosting** | Vercel + Render |

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js >= 14
MongoDB Atlas account
Google Gemini API key
```

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/ai-mental-health-companion.git
cd ai-mental-health-companion
```

**2. Backend Setup**
```bash
cd server
npm install
```

Create `.env` file in server folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

Start server:
```bash
npm run dev
```

**3. Frontend Setup**
```bash
cd client
npm install
npm start
```

---

## 📁 Project Structure
ai-mental-health-companion/
│
├── client/                     # React Frontend
│   └── src/
│       ├── components/         # Reusable components
│       ├── pages/              # Page components
│       │   ├── Login/          # Authentication
│       │   ├── Register/       # User registration
│       │   ├── Home/           # Dashboard
│       │   ├── Chat/           # AI Chat
│       │   ├── Journal/        # Mood journal
│       │   ├── Progress/       # Analytics
│       │   └── Breathing/      # Exercises
│       ├── context/            # React Context
│       ├── services/           # API services
│       └── utils/              # Helpers
│
└── server/                     # Node.js Backend
├── controllers/            # Route handlers
├── models/                 # MongoDB schemas
├── routes/                 # API routes
├── middleware/             # Auth middleware
├── services/               # Gemini AI service
└── config/                 # Database config

---

## 🌿 Design Philosophy

Mitra uses an **"Organic Calm"** design language:

- 🌲 **Forest background** — nature-inspired tranquility
- 💚 **Sage green accents** — healing and growth
- 🔤 **Cormorant Garamond** — elegant, serif warmth
- ✨ **Glassmorphism cards** — modern, minimal depth
- 🌊 **Smooth animations** — gentle, non-jarring

---

## 🤖 AI Response Philosophy

Mitra follows a strict empathy-first approach:

ACKNOWLEDGE the feeling with genuine warmth
VALIDATE why they feel this way
SUPPORT with a caring suggestion
Never start with questions
Never sound robotic or generic


**Example:**
User: "I feel so alone"
Mitra: "Oh, I'm so sorry you're feeling this way. 💙
That kind of pain is real, and you deserve
to have someone sit with you in it.
You are not alone — I'm right here with you."

---

## 🔐 Environment Variables

```env
# Server
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_api_key

# Client (update in aiService.js, authService.js)
REACT_APP_API_URL=http://localhost:5000
```

---

## 🌍 Deployment

### Backend (Render)

Connect GitHub repo
Root Directory: server
Build Command: npm install
Start Command: node server.js
Add environment variables


### Frontend (Vercel)

Connect GitHub repo
Root Directory: client
Framework: Create React App
Deploy!


---

## 📱 Screenshots

| Login | Home | Chat |
|-------|------|------|
| Beautiful forest-themed login | Mood check dashboard | AI companion chat |

| Journal | Progress | Breathing |
|---------|----------|-----------|
| Mood-tagged entries | Analytics charts | Guided exercises |

---

## 🙏 Acknowledgments

- **Google Gemini AI** — for powering compassionate responses
- **Unsplash** — for the beautiful forest photography
- **MongoDB Atlas** — for reliable data storage
- **Recharts** — for beautiful mood visualizations

---

## 👨‍💻 Developer

**Girimurugan**

- 📍 Salem, Tamil Nadu, India
- 💼 Full-Stack Developer
- 🛠️ React.js | Node.js | MongoDB | AI Integration

---

## 📄 License

MIT License — Free to use, modify, and distribute.

---

<div align="center">

**Built with 💚 for mental wellness**

*"Mental health is not a destination, but a process."*

</div>
