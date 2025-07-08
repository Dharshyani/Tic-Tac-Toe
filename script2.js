// script for AI VS Player
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
let playerSymbol = "";
let playerImage = "";
let aiSymbol = "";
let aiImage = "";
let running = false;
let isAI = false;

const urlParams = new URLSearchParams(window.location.search);
const selectedSymbol = urlParams.get('symbol');
const mode = urlParams.get('mode');

if (mode === 'ai') {
    isAI = true;
}

if (selectedSymbol === "fire") {
    playerSymbol = "Fire";
    playerImage = fire;
    aiSymbol = "Snowflake";
    aiImage = snow;
} else if (selectedSymbol === "snow") {
    playerSymbol = "Snowflake";
    playerImage = snow;
    aiSymbol = "Fire";
    aiImage = fire;
}

let currentTurn = "player"; // player always starts

init();

function init() {
    Boxs.forEach(box => box.addEventListener('click', boxClick));
    BtnRestart.addEventListener('click', restartgame);
    running = true;
    updateStatusText();
}

function boxClick() {
    const index = this.dataset.index;
    if (options[index] !== "" || !running || currentTurn !== "player") return;

    playMove(index, playerSymbol, playerImage);
    checkWinner();

    if (isAI && running) {
        currentTurn = "ai";
        updateStatusText();
        setTimeout(aiMove, 500);
    }
}

function playMove(index, symbol, image) {
    options[index] = symbol;
    Boxs[index].innerHTML = image;
}

function updateStatusText() {
    if (currentTurn === "player") {
        statusText.textContent = playerSymbol === "Fire" ? "🔥 Fire's Turn" : "❄️ Snowflake's Turn";
    } else {
        statusText.textContent = aiSymbol === "Fire" ? "🔥 Fire's Turn" : "❄️ Snowflake's Turn";
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
        if (currentTurn === "player") {
            statusText.textContent = playerSymbol === "Fire" ? "🔥 Fire Wins 🎉" : "❄️ Snowflake Wins 🎉";
        } else {
            statusText.textContent = aiSymbol === "Fire" ? "🔥 Fire Wins 🎉" : "❄️ Snowflake Wins 🎉";
        }
        running = false;
    } else if (!options.includes("")) {
        statusText.textContent = "It's a Draw!";
        running = false;
    } else {
        if (currentTurn === "player" && isAI) {
            currentTurn = "ai";
        } else {
            currentTurn = "player";
        }
        updateStatusText();
    }
}

function aiMove() {
    let emptyIndexes = options
        .map((val, idx) => val === "" ? idx : null)
        .filter(idx => idx !== null);

    if (emptyIndexes.length === 0 || !running) return;

    let randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];

    playMove(randomIndex, aiSymbol, aiImage);
    checkWinner();

    if (running) {
        currentTurn = "player";
        updateStatusText();
    }
}

function restartgame() {
    options = ["", "", "", "", "", "", "", "", ""];
    running = true;
    currentTurn = "player";

    Boxs.forEach(box => {
        box.innerHTML = "";
        box.classList.remove('win');
    });

    updateStatusText();
}

