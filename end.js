const headerText = document.getElementsByClassName("header__title");
const playerScore = localStorage.getItem("playerScore");

headerText[0].innerText = `Well done for completing the test!
Your score is ${playerScore}!`;