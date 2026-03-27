// 퀴즈 데이터
const quizData = [
    {
        type: "multiple",
        question: "HTML에서 가장 큰 제목을 나타내는 태그는 무엇인가요?",
        options: ["<heading>", "<h6>", "<h1>", "<title>"],
        answer: 2
    },
    {
        type: "multiple",
        question: "CSS에서 글자 색상을 바꾸는 속성은 무엇인가요?",
        options: ["font-color", "text-color", "color", "background-color"],
        answer: 2
    },
    {
        type: "short",
        question: "웹 페이지의 구조를 뼈대처럼 잡아주는 언어의 이름은 무엇인가요? (영문 4글자)",
        answer: "HTML"
    }
];


// 상태 변수
let currentQuestion = 0
let score = 0
let timerInterval; // 타이머를 담을 변수
let timeLeft = 10; // 10초 설정

// DOM 요소 선택
const questionCount = document.querySelector("#question-count")
const questionText = document.querySelector("#question")
const optionButtons = document.querySelectorAll(".option-btn")
const feedback = document.querySelector("#feedback")
const nextBtn = document.querySelector("#next-btn")
const quizBox = document.querySelector("#quiz-box")
const resultBox = document.querySelector("#result-box")
const resultScore = document.querySelector("#result-score")
const resultMessage = document.querySelector("#result-message")
const restartBtn = document.querySelector("#restart-btn")
const timerDisplay = document.querySelector("#timer");
const startBox = document.querySelector("#start-box");
const startBtn = document.querySelector("#start-btn");
const optionsContainer = document.querySelector("#options");
const shortAnswerContainer = document.querySelector("#short-answer-container");
const shortAnswerInput = document.querySelector("#short-answer-input");
const submitAnswerBtn = document.querySelector("#submit-answer-btn");

// 문제를 화면에 표시하는 함수
function showQuestion() {
    let current = quizData[currentQuestion];

    questionCount.textContent = `문제 ${currentQuestion + 1} / ${quizData.length}`;
    questionText.textContent = current.question;
    feedback.textContent = "";
    nextBtn.style.display = "none";

    // 문제 유형에 따라 화면 다르게 표시
    if (current.type === "multiple") {
        optionsContainer.style.display = "block";
        shortAnswerContainer.style.display = "none";
        
        optionButtons.forEach(function(button, index) {
            button.textContent = current.options[index];
            button.className = "option-btn"; // 스타일 초기화
        });
    } else if (current.type === "short") {
        optionsContainer.style.display = "none";
        shortAnswerContainer.style.display = "flex";
        
        shortAnswerInput.value = ""; // 입력창 비우기
        shortAnswerInput.disabled = false;
        submitAnswerBtn.disabled = false;
        shortAnswerInput.focus(); // 입력창에 바로 커서 깜빡이게 하기
    }

    // 타이머 초기화 및 재시작
    clearInterval(timerInterval);
    timerDisplay.classList.remove("timer-critical"); 
    timeLeft = 10;
    timerDisplay.textContent = `남은 시간: ${timeLeft}초`;
    timerDisplay.style.color = "#f1c40f"; 
    startTimer();
}

// 정답을 확인하는 함수
function checkAnswer(userAnswer) {
    clearInterval(timerInterval); 
    timerDisplay.classList.remove("timer-critical"); 

    let current = quizData[currentQuestion];
    let isCorrect = false;

    // 1. 정답 판별 로직
    if (userAnswer === -1) {
        // 시간 초과
        isCorrect = false;
    } else if (current.type === "short") {
        // 주관식 정답 비교 (양옆 공백 제거 및 대문자로 통일해서 비교)
        let formattedUserAnswer = String(userAnswer).trim().toUpperCase();
        let formattedCorrectAnswer = String(current.answer).trim().toUpperCase();
        
        if (formattedUserAnswer === formattedCorrectAnswer) {
            isCorrect = true;
        }
        shortAnswerInput.disabled = true; // 입력 막기
        submitAnswerBtn.disabled = true; // 버튼 막기
    } else if (current.type === "multiple") {
        // 객관식 정답 비교
        if (userAnswer === current.answer) {
            isCorrect = true;
        }
        
        // 버튼 비활성화 및 색상 처리
        optionButtons.forEach(function(button) {
            button.classList.add("disabled");
        });
        optionButtons[current.answer].classList.add("correct");
        if (!isCorrect && userAnswer !== -1) {
            optionButtons[userAnswer].classList.add("wrong");
        }
    }

    // 2. 피드백 메시지 표시 로직
    if (isCorrect) {
        score = score + 1;
        feedback.textContent = "정답입니다!";
        feedback.style.color = "#2ecc71";
    } else if (userAnswer === -1) {
        // 주관식이면 정답 텍스트를, 객관식이면 안내 문구를 보여줌
        let ansText = current.type === "short" ? `[ ${current.answer} ]` : "위에 초록색으로 표시됩니다";
        feedback.textContent = `시간 초과! 정답은 ${ansText}.`;
        feedback.style.color = "#e74c3c";
        timerDisplay.style.color = "#e74c3c"; 
    } else {
        let ansText = current.type === "short" ? `[ ${current.answer} ]` : "위에 초록색으로 표시됩니다";
        feedback.textContent = `오답입니다! 정답은 ${ansText}.`;
        feedback.style.color = "#e74c3c";
    }

    nextBtn.style.display = "block";
}

// 최종 결과를 보여주는 함수
function showResult() {
    quizBox.style.display = "none"
    resultBox.style.display = "block"

    resultScore.textContent = `${score} / ${quizData.length}`

    let percentage = (score / quizData.length) * 100

    if (percentage === 100) {
        resultMessage.textContent = "완벽합니다! 천재 아닌가요?"
    } else if (percentage >= 80) {
        resultMessage.textContent = "훌륭합니다! 거의 다 맞혔네요!"
    } else if (percentage >= 60) {
        resultMessage.textContent = "잘했습니다! 조금만 더 복습하면 완벽해질 거예요."
    } else {
        resultMessage.textContent = "괜찮습니다! 다시 풀어보면 분명 더 잘할 수 있을 거예요."
    }
}

// 보기 버튼에 이벤트 연결
optionButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        let selectedIndex = Number(button.dataset.index)
        checkAnswer(selectedIndex)
    })
})

// "다음 문제" 버튼 이벤트
nextBtn.addEventListener("click", function() {
    currentQuestion = currentQuestion + 1

    if (currentQuestion < quizData.length) {
        showQuestion()
    } else {
        showResult()
    }
})

// "다시 풀기" 버튼 이벤트
restartBtn.addEventListener("click", function() {
    // 1. 퀴즈 상태 초기화
    currentQuestion = 0;
    score = 0;

    // 2. 화면 전환: 결과창 숨기고 시작 화면 띄우기
    resultBox.style.display = "none";
    startBox.style.display = "block"; 
    
    // (주의: 여기서는 showQuestion()을 호출하지 않습니다! 
    // 나중에 사용자가 '퀴즈 시작' 버튼을 다시 누를 때 실행됩니다.)
})

function startTimer() {
    // 1초마다 실행
    timerInterval = setInterval(function() {
        timeLeft = timeLeft - 1;
        timerDisplay.textContent = `남은 시간: ${timeLeft}초`;

        // ✅ [추가] 3초 이하일 때 깜빡이는 클래스 추가
        if (timeLeft <= 3 && timeLeft > 0) {
            timerDisplay.classList.add("timer-critical");
        }

        // 시간이 0이 되면
        if (timeLeft <= 0) {
            clearInterval(timerInterval); // 타이머 멈춤
            // ✅ [추가] 시간이 다 되면 깜빡임 멈춤 (클래스 제거)
            timerDisplay.classList.remove("timer-critical"); 
            checkAnswer(-1); // 시간 초과 상태로 호출
        }
    }, 1000);
}

startBtn.addEventListener("click", function() {
    startBox.style.display = "none"; // 시작 화면 숨기기
    quizBox.style.display = "block"; // 퀴즈 화면 보이기
    showQuestion(); // 첫 문제 표시 및 타이머 시작
});

// 주관식 '제출' 버튼 클릭 이벤트
submitAnswerBtn.addEventListener("click", function() {
    let answer = shortAnswerInput.value;
    if (answer.trim() === "") {
        // 빈칸일 경우 경고창
        alert("정답을 입력해주세요!");
        return;
    }
    checkAnswer(answer);
});

// 주관식 입력창에서 '엔터(Enter)' 키 눌렀을 때 제출되게 하기
shortAnswerInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        submitAnswerBtn.click();
    }
});