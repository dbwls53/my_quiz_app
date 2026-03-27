// 퀴즈 데이터
const quizData = [
    {
        type: "short",
        question: "나의 생일은? (숫자 8자리로 입력. 예 : 20000209)",
        answer: "20031117"
    },
    {
        type: "short",
        question: "나의 전화번호는? (숫자 11자리로 입력. 예 : 01022554160)",
        answer: "01074305324"
    },
    {
        type: "short",
        question: "우리가 처음 사귀기로 한 날짜는? (숫자 8자리로 입력)",
        answer: "20250801"
    },
    {
        type: "multiple",
        question: "내가 싫어하는 음식은?",
        options: ["마라탕", "우육면", "오돌뼈", "오이"],
        answer : 2
    },
    {
        type: "multiple",
        question: "내가 외출 준비할 때 가장 오래 걸리는 단계는?",
        options: ["씻기", "옷 고르기", "화장하기", "짐챙기기"],
        answer : 1
    },
    {
        type: "multiple",
        question: "내가 세상에서 제일 무서워하는 것은?",
        options: ["벌레", "귀신", "오빠의 침묵", "높은 곳"],
        answer : 1
    },
    {
        type: "short",
        question: "내가 세상에서 가장 자신 있게 만들 수 있는 요리는?",
        answer: "에그인헬"
    },
    {
        type: "multiple",
        question: "내가 가장 좋아하는 연락 수단은?",
        options: ["카톡", "통화", "영상통화", "만나서 말하기"],
        answer : 3
    },
    {
        type: "short",
        question: "내가 생각하는 나의 매력 포인트 1위는 어디일까?",
        answer: "눈"
    },
    {
        type: "multiple",
        question: "내가 편의점에서 딱 하나만 고를 수 있다면?",
        options: ["뿌셔뿌셔", "자일리톨껌", "불닭볶음면", "여신마라샹궈"],
        answer : 3
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
const finalMessage = document.querySelector("#final-message");
const sendMessageBtn = document.querySelector("#send-message-btn");

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
        resultMessage.textContent = "100점 만점에 100점! 💯 나를 너무 잘 알아서 감동이야 ❤️"
    } else if (percentage >= 80) {
        resultMessage.textContent = "아쉽게 만점은 놓쳤지만 합격 목걸이는 쥐어드립니다~ 🏅"
    } else if (percentage >= 60) {
        resultMessage.textContent = "혹시 찍어서 맞춘 건 아니겠지?🥺 틈틈이 복습하도록!"
    } else {
        resultMessage.textContent = "아래 입력창에 해명문 100자 이상 작성할 것 📝🔥"
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

sendMessageBtn.addEventListener("click", function() {
    const message = finalMessage.value;
    
    // 빈칸 검사
    if (message.trim() === "") {
        alert("메시지를 입력해주세요!");
        return;
    }

    // 🚨 여기에 나만의 Formspree 주소를 넣어야 합니다 (아래 4번 설명 참고)
    const formspreeUrl = "https://formspree.io/f/xaqlnlyl"; 

    // 전송 중 상태 표시
    sendMessageBtn.textContent = "전송 중...";
    sendMessageBtn.disabled = true;

    // 데이터 전송
    fetch(formspreeUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            // 이메일로 받을 내용 (점수도 같이 보내면 재밌어요!)
            퀴즈점수: `${score}점`,
            남긴메시지: message
        })
    })
    .then(response => {
        if (response.ok) {
            alert("메시지가 성공적으로 전송되었습니다! ❤️");
            finalMessage.value = ""; // 입력창 비우기
            sendMessageBtn.textContent = "전송 완료";
        } else {
            alert("전송에 실패했습니다. 다시 시도해주세요.");
            sendMessageBtn.textContent = "메시지 보내기";
            sendMessageBtn.disabled = false;
        }
    })
    .catch(error => {
        alert("인터넷 연결을 확인해주세요.");
        sendMessageBtn.textContent = "메시지 보내기";
        sendMessageBtn.disabled = false;
    });
});