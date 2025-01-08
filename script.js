let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let timeLeft = 5;  // Set the time limit to 5 seconds

// Sounds
const correct = new Audio('sounds/correct.mp3');
const wrong = new Audio('sounds/wrong.mp3');
const passed = new Audio('sounds/happy.mp3');
const failed = new Audio('sounds/sad.mp3');
const timer = new Audio('sounds/tick.mp3');

// Elements
const addQuestionButton = document.getElementById('add-question');
const startQuizButton = document.getElementById('start-quiz');
const flashcard = document.getElementById('flashcard');
const questionText = document.getElementById('question-text');
const answersList = document.getElementById('answers-list');
const nextQuestionButton = document.getElementById('next-question');
const resultSection = document.getElementById('result-section');
const scoreElement = document.getElementById('score');
const resultText = document.getElementById('result-text');
const timerDisplay = document.getElementById('timer-display');

// Add question to the quiz array
addQuestionButton.addEventListener('click', (event) => {
    event.preventDefault();

    const question = document.getElementById('question').value;
    const correctAnswer = document.getElementById('correct-answer').value;
    const wrongAnswer1 = document.getElementById('wrong-answer-1').value;
    const wrongAnswer2 = document.getElementById('wrong-answer-2').value;
    const wrongAnswer3 = document.getElementById('wrong-answer-3').value;

    if (!question || !correctAnswer || !wrongAnswer1 || !wrongAnswer2 || !wrongAnswer3) {
        alert("Please fill in all fields before adding a question!");
        return;
    }

    questions.push({
        question,
        correctAnswer,
        wrongAnswers: [wrongAnswer1, wrongAnswer2, wrongAnswer3]
    });

    // Clear form inputs after adding a question
    document.getElementById('question').value = '';
    document.getElementById('correct-answer').value = '';
    document.getElementById('wrong-answer-1').value = '';
    document.getElementById('wrong-answer-2').value = '';
    document.getElementById('wrong-answer-3').value = '';

    // Update question count
    document.getElementById('question-count').textContent = `Questions added: ${questions.length}`;

    // Show start quiz button when questions are added
    if (questions.length > 0) {
        startQuizButton.style.display = 'inline-block';
    }
});

// Start quiz
startQuizButton.addEventListener('click', () => {
    startQuizButton.style.display = 'none';
    document.getElementById('input-section').style.display = 'none';
    document.getElementById('quiz-section').style.display = 'block';
    showQuestion(currentQuestionIndex);
});

// Show a specific question
function showQuestion(index) {
    if (index >= questions.length) {
        endQuiz();
        return;
    }

    const questionObj = questions[index];
    questionText.textContent = questionObj.question;

    answersList.innerHTML = '';
    answersList.style.display = 'none';

    let answers = [questionObj.correctAnswer, ...questionObj.wrongAnswers];
    answers = shuffleArray(answers);

    answers.forEach(answer => {
        const answerButton = document.createElement('button');
        answerButton.textContent = answer;
        answerButton.onclick = () => checkAnswer(answer, questionObj.correctAnswer);
        answersList.appendChild(answerButton);
    });

    answersList.style.display = 'block';

    // Start the timer for this question
	timer.play();
    timeLeft = 10;  // Reset timer to 5 seconds
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;
    clearInterval(timerInterval); // Clear any existing timer
    timerInterval = setInterval(updateTimer, 1000);  // Start a new interval
}

// Update the timer
function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;

    // Change the timer display color when it gets critical
    if (timeLeft <= 3) {
        timerDisplay.classList.add('critical');  // Apply critical styling
    } else if (timeLeft <= 0) {
        timerDisplay.classList.add('warning');  // Apply warning styling
    }

    if (timeLeft <= 0) {
        clearInterval(timerInterval);
		wrong.play();
        resultText.textContent = 'Time is up!';
        flashcard.style.backgroundColor = "#FFEB3B"; // Yellow for timeout
        flashcard.classList.add('flip');
        setTimeout(() => {
            answersList.style.display = 'none';
            nextQuestionButton.style.display = 'inline-block';
        }, 1000);  // Wait for the flip effect before showing next button
    }
}

// Shuffle answers to randomize order
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Check if the answer is correct
function checkAnswer(answer, correctAnswer) {
	timer.pause();
	timer.currentTime = 0;
    clearInterval(timerInterval);  // Stop the timer when the answer is selected

    if (answer === correctAnswer) {
		correct.play();
        score++;
        resultText.textContent = 'Correct';
        flashcard.style.backgroundColor = "Green";  // Green for correct
    } else {
		wrong.play();
        resultText.textContent = 'Wrong';
        flashcard.style.backgroundColor = "Red"  // Red for wrong
    }

    flashcard.classList.add('flip');  // Flip the flashcard
    setTimeout(() => {
        answersList.style.display = 'none';
        nextQuestionButton.style.display = 'inline-block';
    }, 1000);  // Wait for the flip effect before showing next button
}

// Go to the next question
nextQuestionButton.addEventListener('click', () => {
    currentQuestionIndex++;
    nextQuestionButton.style.display = 'none';
    flashcard.classList.remove('flip');
    flashcard.style.backgroundColor = "";
    showQuestion(currentQuestionIndex);
});

// End quiz and show results
function endQuiz() {
    document.getElementById('quiz-section').style.display = 'none';
    scoreElement.textContent = `You scored ${score} out of ${questions.length}`;
    resultSection.style.display = 'block';
}

// Retake quiz
document.getElementById('retake-quiz').addEventListener('click', () => {
    score = 0;
    currentQuestionIndex = 0;
    resultSection.style.display = 'none';
    document.getElementById('quiz-section').style.display = 'block';
    nextQuestionButton.style.display = 'none';
    showQuestion(currentQuestionIndex);
});

// Recreate questions
document.getElementById('recreate-questions').addEventListener('click', () => {
    questions = [];
    score = 0;
    currentQuestionIndex = 0;
    resultSection.style.display = 'none';
    document.getElementById('input-section').style.display = 'block';
    document.getElementById('quiz-section').style.display = 'none';
    document.getElementById('question-form').reset();
});

// End quiz and show results
function endQuiz() {
    document.getElementById('quiz-section').style.display = 'none';
    const totalQuestions = questions.length;
    const percentage = (score / totalQuestions) * 100;
    let feedback;
	
    if (percentage === 100) {
		passed.play();
        feedback = "Perfect! You answered all the questions correctly!";
    } else if (percentage >= 70) {
		passed.play();
        feedback = "Good job! You scored 70% or higher.";
    } else {
		failed.play();
        feedback = "Failed. You scored below 70%. Better luck next time!";
    }
	
    scoreElement.textContent = `You scored ${score} out of ${totalQuestions}`;
    resultText.textContent = feedback;
	resultText.style.display = 'block';
    resultSection.style.display = 'block';
}