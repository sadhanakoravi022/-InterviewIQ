# 🤖 InterviewIQ - AI Interview Practice

An AI-powered interview simulator that helps you sharpen your interview skills with real-time feedback and evaluation.

![Landing Page](IMG/Screenshot%202026-03-31%20221748.png)

## ✨ Features

- **🎯 Multiple Topics** - Practice interviews for General (Behavioral), Python, Java, React, and Data Science roles
- **📊 Adjustable Difficulty** - Choose between Easy, Medium, and Hard difficulty levels
- **💬 Real-time Feedback** - Get instant AI evaluation of your answers
- **📈 Score Tracking** - Monitor your performance with scores out of 10
- **💡 Sample Answers** - Learn from high-quality correct answers provided after each question
- **📉 Progress Visualization** - Track your previous scores with a bar chart

![Practice Session](IMG/Screenshot%202026-03-31%20221935.png)

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast Python web framework
- **Groq** - AI model integration for question generation and answer evaluation
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Frontend
- **HTML5/CSS3** - Modern responsive UI
- **Vanilla JavaScript** - No framework dependencies
- **Font Awesome** - Icons
- **Google Fonts (Outfit, Inter)** - Typography

## 📦 Installation

### Prerequisites
- Python 3.8+
- Groq API Key

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/InterviewIQ.git
   cd InterviewIQ
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv .venv
   
   # Windows
   .venv\Scripts\activate
   
   # macOS/Linux
   source .venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure API Key**
   
   Open `backend/main.py` and update the following:
   ```python
   API_KEY = "your_groq_api_key_here"
   MODEL = "llama3-8b-8192"  # or your preferred Groq model
   ```

## 🚀 Usage

1. **Start the backend server**
   ```bash
   cd backend
   python main.py
   ```
   The server will start at `http://127.0.0.1:8001`

2. **Open the application**
   
   Navigate to `http://127.0.0.1:8001` in your browser

3. **Start practicing!**
   - Click "Start Practice Session"
   - Select your topic and difficulty
   - Answer the AI interviewer's questions
   - Receive instant feedback and scores

## 📁 Project Structure

```
InterviewIQ/
├── backend/
│   └── main.py          # FastAPI backend with Groq integration
├── frontend/
│   ├── index.html       # Main HTML file
│   ├── style.css        # Styling
│   └── script.js        # Frontend logic
├── IMG/                  # Screenshots
├── requirements.txt      # Python dependencies
└── README.md
```

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/interview/start` | POST | Start a new interview session |
| `/interview/evaluate` | POST | Submit answer and get evaluation |

## 🎨 UI Features

- **Welcome Screen** - Clean landing page with feature highlights
- **Chat Interface** - Conversational UI for natural interaction
- **Feedback Panel** - Real-time score display, strengths, and improvement areas
- **Score History** - Visual bar chart of previous scores
- **Performance Summary** - Quick overview of recent performance

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

<p align="center">Made with ❤️ for interview preparation</p>
