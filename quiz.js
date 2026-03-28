// 퀴즈 데이터
const quizData = [
    {
        type: "multiple",
        question: "내가 안경이나 렌즈를 안 꼈을 때, 나의 시력 상태는?",
        options: ["-7.0", "-8.0", "-9.0", "-10.0"],
        answer: 2
    },
    {
        type: "multiple",
        question: "내가 제일 좋아하는 고기 굽기 정도는?",
        options: ["레어", "미디움 레어", "미디움", "웰던"],
        answer: 0
    },
    {
        type: "multiple",
        question: "내가 생각하는 우리의 가장 이상적인 데이트는?",
        options: ["활동적인 액티비티", "하루종일 호캉스", "맛집 탐방", "심야 영화 보기"],
        answer: 2
    },
    {
        type: "multiple",
        question: "다시 태어난다면 내가 되고 싶은 동물은?",
        options: ["강아지", "고양이", "새", "판다"],
        answer: 1
    },
    {
        type: "multiple",
        question: "내가 영화관에서 가장 좋아하는 팝콘 맛은?",
        options: ["고소한맛", "달콤한맛(카라멜)", "어니언맛", "치즈맛"],
        answer: 1
    },
    {
        type: "multiple",
        question: "내가 좋아하는 계절 순서대로 맞는 것은?",
        options: ["봄-여름-가을-겨울", "가을-봄-겨울-여름", "여름-가을-봄-겨울", "겨울-봄-가을-여름"],
        answer: 1
    },
    {
        type: "multiple",
        question: "내가 스트레스를 받았을 때 푸는 가장 선호하는 방법은?",
        options: ["잠자기", "매운 거 먹기", "쇼핑하기", "오빠한테 조잘조잘 말하기"],
        answer: 3
    },
    {
        type: "multiple",
        question: "내가 가장 좋아하는 붕어빵 부위는?",
        options: ["머리", "등", "꼬리", "상관없음"],
        answer: 2
    },
    {
        type: "multiple",
        question: "내가 더 못 참는 상황은?",
        options: ["배고픈데 줄 서야 함", "졸린데 잠 못 잠", "더운데 에어컨 없음", "심심한데 할 거 없음"],
        answer: 3
    },
    {
        type: "multiple",
        question: "오빠가 나에게 준 첫 번째 꽃다발의 주된 꽃 종류는?",
        options: ["수국", "메리골드", "거베라", "해바라기"],
        answer: 2
    },
    {
        type: "multiple",
        question: "내 얼굴에서 점이 있는 위치 중 틀린 것은?",
        options: ["왼쪽 눈 밑", "오른쪽 눈 밑", "코 끝","입술 아래"],
        answer: 0
    },
    {
        type: "multiple",
        question: "우리가 수원에서 갔던 식당의 이름은?",
        options: ["김경자소문난대구왕뽈찜", "김경자소문난왕대구뽈찜", "소문난김경자대구왕뽈찜", "소문난김경자왕대구뽈찜"],
        answer: 0
    },
    {
        type: "short",
        question: "우리가 처음으로 같이 먹은 음식은? (예: 삼겹살)",
        answer: "김치찌개"
    },
    {
        type: "short",
        question: "우리의 첫 커플템은?",
        answer: "보조배터리"
    },
    {
        type: "short",
        question: "오빠가 이 퀴즈를 다 풀고 나서 나에게 해줬으면 하는 행동은?",
        answer: "포옹"
    }
    
];


// 상태 변수
let currentQuestion = 0
let score = 0
let timerInterval; // 타이머를 담을 변수
let timeLeft = 15; // 15초 설정

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
    timeLeft = 15;
    timerDisplay.textContent = `남은 시간: ${timeLeft}초`;
    timerDisplay.style.color = "#f1c40f"; 
    startTimer();
}

// 정답을 확인하는 함수
function checkAnswer(userAnswer) {
    // [가드 로직] 이미 채점이 끝났다면 무시 (이전 단계에서 추가한 부분)
    if (nextBtn.style.display === "block") {
        return;
    }

    clearInterval(timerInterval);
    timerDisplay.classList.remove("timer-critical");

    let current = quizData[currentQuestion];
    let isCorrect = false;

    // 1. [수정] 주관식/객관식 통합 채점 및 UI 처리 로직

    if (current.type === "short") {
        // === 주관식 처리 ===
        shortAnswerInput.disabled = true; // 입력 막기
        submitAnswerBtn.disabled = true; // 버튼 막기

        if (userAnswer === -1) {
            // 시간 초과
            isCorrect = false;
        } else {
            // 정답 비교 (양옆 공백 제거 및 대문자로 통일해서 비교)
            let formattedUserAnswer = String(userAnswer).trim().toUpperCase();
            let formattedCorrectAnswer = String(current.answer).trim().toUpperCase();
            if (formattedUserAnswer === formattedCorrectAnswer) {
                isCorrect = true;
            }
        }
    } else if (current.type === "multiple") {
        // === 객관식 처리 ===
        
        // [핵심 수정] 시간 초과든 오답이든, 객관식이라면 무조건 버튼 비활성화 및 정답 표시
        optionButtons.forEach(function(button) {
            button.classList.add("disabled");
        });
        
        // 무조건 정답 버튼에 'correct' 클래스 추가
        optionButtons[current.answer].classList.add("correct");

        if (userAnswer === -1) {
            // 시간 초과
            isCorrect = false;
        } else {
            // 정답 비교
            if (userAnswer === current.answer) {
                isCorrect = true;
            } else {
                // 오답을 선택했다면 해당 버튼에 'wrong' 클래스 추가
                optionButtons[userAnswer].classList.add("wrong");
            }
        }
    }

    // 2. 피드백 메시지 표시 로직 (기존과 동일)
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
        resultMessage.textContent = "100점 만점에 100점! 💯 우리 앞으로의 100년도 이 점수처럼 완벽하고 행복하게 보내자 ❤️"
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
