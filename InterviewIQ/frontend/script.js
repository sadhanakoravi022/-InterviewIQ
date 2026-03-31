const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const topicSelect = document.getElementById('topic-select');
const difficultySelect = document.getElementById('difficulty-select');

// Sidebar elements
const currentScore = document.getElementById('current-score');
const strengthsList = document.getElementById('strengths-list');
const improvementsList = document.getElementById('improvements-list');
const scoresChart = document.getElementById('previous-scores-chart');
const nextTip = document.getElementById('next-tip');
const recentPerf = document.getElementById('recent-perf');
const welcomeScreen = document.getElementById('welcome-screen');
const appHeader = document.getElementById('app-header');
const appMain = document.getElementById('app-main');
const startBtn = document.getElementById('start-interview-btn');

const API_BASE = "http://127.0.0.1:8001";
let interviewHistory = [];
let previousQuestions = [];
let lastQuestion = "";
let previousScores = [];

// Helper: Append Message
function appendMessage(role, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.innerHTML = role === 'ai' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerText = text;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Start Interview
async function startPractice() {
    sendBtn.disabled = true;
    chatMessages.innerHTML = '';
    previousQuestions = [];
    interviewHistory = [];
    appendMessage('ai', "Initializing interview session... Connecting to AI backend.");
    
    try {
        // Test connection first
        const healthCheck = await fetch(`${API_BASE}/health`).catch(() => null);
        if (!healthCheck || !healthCheck.ok) {
            throw new Error("Backend unreachable");
        }

        const response = await fetch(`${API_BASE}/interview/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topic: topicSelect.value,
                difficulty: difficultySelect.value,
                previous_questions: previousQuestions
            })
        });
        
        const data = await response.json();
        lastQuestion = data.question;
        previousQuestions.push(lastQuestion);
        chatMessages.innerHTML = ''; // Clear the "Initializing" message
        appendMessage('ai', "Hello! I'm your professional interviewer. Let's begin the session.");
        appendMessage('ai', lastQuestion);
    } catch (error) {
        console.error("Error starting interview:", error);
        appendMessage('ai', "🔴 Connection Error: The AI backend is not responding. Please ensure the backend server is running on http://127.0.0.1:8001");
    } finally {
        sendBtn.disabled = false;
    }
}

// Evaluate Answer
async function submitAnswer() {
    const answer = userInput.value.trim();
    if (!answer) return;

    appendMessage('user', answer);
    userInput.value = '';
    sendBtn.disabled = true;
    
    // Show Thinking indicator
    const thinkingId = 'thinking-' + Date.now();
    const thinkingDiv = document.createElement('div');
    thinkingDiv.className = 'message ai thinking';
    thinkingDiv.id = thinkingId;
    thinkingDiv.innerHTML = '<div class="avatar"><i class="fas fa-robot"></i></div><div class="bubble">...</div>';
    chatMessages.appendChild(thinkingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const response = await fetch(`${API_BASE}/interview/evaluate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topic: topicSelect.value,
                difficulty: difficultySelect.value,
                question: lastQuestion,
                answer: answer,
                previous_questions: previousQuestions
            })
        });
        
        const thinkingIndicator = document.getElementById(thinkingId);
        if (thinkingIndicator) thinkingIndicator.remove();

        const data = await response.json();
        updateUI(data);
        
        // Update history and question
        interviewHistory.push({ question: lastQuestion, answer: answer, evaluation: data.evaluation });
        lastQuestion = data.next_question;
        previousQuestions.push(lastQuestion);
        
        // AI Response
        setTimeout(() => {
            appendMessage('ai', lastQuestion);
        }, 800);

    } catch (error) {
        console.error("Error submitting answer:", error);
        appendMessage('ai', "🔴 Error: Failed to evaluate answer. Please check your connection.");
    } finally {
        sendBtn.disabled = false;
    }
}

function updateUI(data) {
    // Score
    currentScore.innerText = `${data.evaluation.score} / 10`;
    
    // Feedback (replace strengths with feedback)
    strengthsList.innerHTML = '';
    const feedbackLi = document.createElement('li');
    feedbackLi.innerText = data.evaluation.feedback;
    strengthsList.appendChild(feedbackLi);
    
    // Improvements (replace with correct answer)
    improvementsList.innerHTML = '';
    const correctLi = document.createElement('li');
    correctLi.innerHTML = `<strong>Correct Answer:</strong> ${data.evaluation.correct_answer}`;
    improvementsList.appendChild(correctLi);
    
    // Chart
    previousScores.push(data.evaluation.score);
    updateChart();
    
    // Next Tip (use part of feedback or generic tip)
    nextTip.innerText = `"Keep up the great work! Ready for the next one?"`;
    
    // Performance
    if (data.evaluation.score >= 8) {
        recentPerf.innerText = "Excellent";
        recentPerf.className = "value green";
    } else if (data.evaluation.score >= 6) {
        recentPerf.innerText = "Good";
        recentPerf.className = "value green";
    } else {
        recentPerf.innerText = "Needs Improvement";
        recentPerf.className = "value";
        recentPerf.style.color = "#f59e0b";
    }
}

function updateChart() {
    scoresChart.innerHTML = '';
    // Show last 7 scores
    const displayScores = previousScores.slice(-7);
    displayScores.forEach(score => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${score * 10}%`;
        bar.setAttribute('data-score', score);
        scoresChart.appendChild(bar);
    });
}

// Event Listeners
sendBtn.addEventListener('click', submitAnswer);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') submitAnswer();
});

topicSelect.addEventListener('change', startPractice);
difficultySelect.addEventListener('change', startPractice);

// Start Button Handler
startBtn.addEventListener('click', () => {
    welcomeScreen.classList.add('hidden');
    appHeader.classList.remove('hidden');
    appMain.classList.remove('hidden');
    startPractice();
});
