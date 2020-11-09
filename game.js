const question = document.getElementsByClassName("question");
const answers = [...document.getElementsByClassName("answer__text")]; //choises
const counterText = document.getElementsByClassName("hud__counter");
const scoreText = document.getElementsByClassName("hud__score");
const game = document.getElementById("game");
const loader = document.getElementById("loader");



let questionsList = [];

fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple")
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questionsList = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;

            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer);

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;

        });
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });



let activeQuestion = {};
let score = 0;
let questionCounter = 0;
let remainingQuestions = []; //avavibleQuestion
let answerFlag = false;

const goodAnswerPoints = 10;
const numberOfQuestions = 5;



startGame = () => {
    questionCounter = 0;
    score = 0;
    remainingQuestions = [...questionsList];
    newQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
}


newQuestion = () => {


    if (questionCounter >= numberOfQuestions || remainingQuestions.length === 0) {
        localStorage.setItem("playerScore", score)
        return window.location.assign('end.html');
    }
    questionCounter++;
    counterText[0].innerText = `${questionCounter}/${numberOfQuestions}`;
    activeQuestion = remainingQuestions[0];
    question[0].innerText = activeQuestion.question;

    answers.forEach(answer => {
        const number = answer.dataset['number'];
        answer.innerText = activeQuestion[`choice${number}`]
    })

    remainingQuestions.splice(0, 1);

    answerFlag = true;
}

answers.forEach(answer => {
    answer.addEventListener("click", e => {
        if (!answerFlag) return;
        answerFlag = false;
        const playerChoice = e.target;
        const playerChoiceIndex = e.target.dataset["number"];

        let afterAnswerClass = "correct"
        if (playerChoiceIndex == activeQuestion.answer) {
            afterAnswerClass = 'correct';
            addScore()
        } else {
            afterAnswerClass = 'incorrect';
        }

        playerChoice.parentElement.classList.add(afterAnswerClass);

        setTimeout(() => {
            playerChoice.parentElement.classList.remove(afterAnswerClass);
            newQuestion();
        }, 2000)
    })
})

addScore = () => {
    score += goodAnswerPoints;
    scoreText[0].innerText = score;
}