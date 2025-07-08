// script for player vs player
const Boxs = document.querySelectorAll('.box');
const statusText = document.querySelector('#status');
const BtnRestart = document.querySelector('#restart');

let fire = "<img src='assests/fire.png' width='80' height='80'>";
let snow = "<img src='assests/snow1.png' width='80' height='80'>";

const win = [
    [0, 1, 2], 
    [3, 4, 5], 
    [6, 7, 8],
    [0, 3, 6], 
    [1, 4, 7], 
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayerImage = "";   
let currentSymbol = "";       
let firstMoveDone = false;
let running = false;

const urlParams = new URLSearchParams(window.location.search);
const selectedSymbol = urlParams.get('symbol');

if (selectedSymbol === "fire") {
    currentSymbol = "Fire";
    currentPlayerImage = fire;
    firstMoveDone = true;
} else if (selectedSymbol === "snow") {
    currentSymbol = "Snowflake";
    currentPlayerImage = snow;
    firstMoveDone = true;
}

init();

function init() {
    Boxs.forEach(box => box.addEventListener('click', boxClick));
    BtnRestart.addEventListener('click', restartgame);
    statusText.textContent = "Player's Turn";
    running = true;
}

function boxClick() {
    const index = this.dataset.index;
    if (options[index] !== "" || !running) return;

    if (!firstMoveDone) {
        currentSymbol = "Fire";
        currentPlayerImage = fire;
        firstMoveDone = true;
    }

    updateBox(this, index);
    checkWinner();
}

function updateBox(box, index) {
    options[index] = currentSymbol;
    box.innerHTML = currentPlayerImage;
}

function changePlayer() {
    if (currentSymbol === "Fire") {
        currentSymbol = "Snowflake";
        currentPlayerImage = snow;
    } else {
        currentSymbol = "Fire";
        currentPlayerImage = fire;
    }
    updateStatusText();
}

function updateStatusText() {
    if (!firstMoveDone) {
        statusText.textContent = "Player's Turn";
    } else {
        statusText.textContent = currentSymbol === "Fire"
            ? "🔥 Fire's Turn"
            : "❄️ Snowflake's Turn";
    }
}

function checkWinner() {
    let isWon = false;
    for (let i = 0; i < win.length; i++) {
        let [a, b, c] = win[i];
        if (options[a] && options[a] === options[b] && options[a] === options[c]) {
            isWon = true;
            Boxs[a].classList.add('win');
            Boxs[b].classList.add('win');
            Boxs[c].classList.add('win');
            break;
        }
    }

    if (isWon) {
        statusText.textContent = currentSymbol === "Fire"
            ? "🔥 Fire Wins 🎉"
            : "❄️ Snowflake Wins 🎉";
        running = false;
    } else if (!options.includes("")) {
        statusText.textContent = "It's a Draw!";
        running = false;
    } else {
        changePlayer();
    }
}

function restartgame() {
    options = ["", "", "", "", "", "", "", "", ""];
    currentPlayerImage = "";
    currentSymbol = "";
    firstMoveDone = false;
    running = true;
    statusText.textContent = "Player's Turn";

    Boxs.forEach(box => {
        box.innerHTML = "";
        box.classList.remove('win');
    });
}
