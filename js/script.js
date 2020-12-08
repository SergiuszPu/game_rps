'use strict';


const modals = document.querySelectorAll('.modal');
const newGameButton = document.getElementById('newGameBtn');
const playerMoves = document.getElementById("playerMoves");
const resultPlayerName = document.querySelector("#resultScoreName");
const playerNameInput = document.querySelector("#player-name");
const outputMessages = document.getElementById("outputResult");
const roundsNumberInput = document.querySelector("#rounds-number");
const startGameButton = document.querySelector("#start-button");

const params = {
    playerPoints: 0,
    cpuPoints: 0,
    rounds: 0,
    message: "",
    progress: []
};

const gameProgress = {
    roundNumber: 0,
    message: "",
    result: ""
};

function showModal(modalId) {
    document.querySelector("#modal-overlay").classList.add('show')
    modals.forEach(el => {
        el.classList.remove('show');
    });
    document.querySelector(modalId).classList.add('show');
}

function hideModal() {
    document.querySelector("#modal-overlay").classList.remove('show');
}

document.querySelector("#modal-overlay").addEventListener('click', showModal)

for (let modal of modals) {
    // console.log(modal);
    modal.addEventListener('click', (event) => {
        event.stopPropagation();
    });
}

const closeButton = document.querySelectorAll('.modalClose');

for (let button of closeButton) {
    // console.log(button);
    button.addEventListener('click', hideModal);
}

function modalContent(modalId) {
    let modal = document.querySelector(modalId);
    let modalHeader = modal.querySelector('.modalHeader');
    let modalTableContentColumns = document.querySelectorAll('.modalTable_column');

    modalHeader.innerHTML = params.message;

    modalTableContentColumns.forEach(col => {
        while (col.firstChild) {
            col.removeChild(col.firstChild)
        }
    });

    for (let i = 0; i < params.progress.length; i++) {
        console.log(i);
        let roundsNewDiv = document.createElement('div');
        roundsNewDiv.innerHTML = params.progress[i].roundNumber;
        let playerMovesNewDiv = document.createElement('div');
        playerMovesNewDiv.innerHTML = params.progress[i].message;
        let resultNewDiv = document.createElement('div');
        resultNewDiv.innerHTML = params.progress[i].result;
        document.querySelector(".tableRounds").appendChild(roundsNewDiv);
        document.querySelector(".tablePlayerMoves").appendChild(playerMovesNewDiv);
        document.querySelector(".tableResult").appendChild(resultNewDiv);
    }
}

function score(pointTo, action) {
    if (action == "addPoint" && pointTo == "cpu") {
        params.cpuPoints += 1;
    } else if (action == "addPoint" && pointTo == "player") {
        params.playerPoints += 1;
    } else if (action == "noPoint" && pointTo == "noOne") {
        params.playerPoints = 0;
        params.cpuPoints = 0;
    }

    playerScore.innerHTML = params.playerPoints;
    cpuScore.innerHTML = params.cpuPoints;
}

function startGameSettings() {
    playerMoves.classList.remove('invisible');
    resultPlayerName.innerHTML = playerNameInput.value;
    outputMessages.innerHTML =
        "Rusz się! Masz: " +
        roundsNumberInput.value +
        "rund żeby wygrać" +
        "<br>" +
        "Spróbuj szcześcia";
    score("noOne", "noPoint");
}

function gameInit() {
    showModal('#startModal');
    playerMoves.classList.add('invisible');
}

function startGame() {
    hideModal();
    startGameSettings();
    params.rounds = roundsNumberInput.value;
    gameProgress.roundNumber = 0;
    params.progress = []
}

startGameButton.addEventListener('click', startGame);
newGameButton.addEventListener('click', gameInit);

function startModalValidation() {
    startGameButton.disabled = true;
    // console.log(playerNameInput.length);
    if (playerNameInput.value.length > 0 && roundsNumberInput.value.length > 0) {
        startGameButton.disabled = false;
    }
}

// function checkValidity() {
//     if (this.value.length() > 0) return true;
//     else false
// }

document.querySelectorAll(".modal_input").forEach(el => {
    el.addEventListener('keyup', function () {
        startModalValidation();
    });
    el.addEventListener('change', function () {
        startModalValidation();
    });
});

function winTournament() {
    let messageWithResult =
        params.playerPoints + " - " + params.cpuPoints + "<br><br>";
    let message;

    if (params.cpuPoints == params.rounds) {
        message =
            messageWithResult +
            "game over" +
            "<br>" +
            "You have LOST the game!" +
            "<br>" +
            "Please start a 'new game'";
    } else if (params.playerPoints == params.rounds) {
        message =
            messageWithResult +
            "game over" +
            "<br>" +
            "You have WON the game!" +
            "<br>" +
            "Please start a 'new game'";
    }

    if ( params.cpuPoints == params.rounds ||
        params.playerPoints == params.rounds ) {
        params.message = message;
        modalContent("#scoreModal");
        showModal("#scoreModal");
        playerMoves.classList.add("invisible");
        score("noOne", "noPoint");
        outputMessages.innerHTML =
            "Click 'new gamme' to start" + "<br>" + "Try your luck!";
        resultPlayerName.innerHTML = "player";
    }
}

// Computer move
function computerChoice() {
    return Math.floor(Math.random() * 3) + 1;
}


// Player move
function playerMove(moveP) {
    let pcMove = computerChoice();
    let moveNames = ["Rock", "Paper", "Scissors"];
    let playerName = playerNameInput.value;
    let message =
        playerName +
        " played " +
        moveP +
        " / Computer played " +
        moveNames[pcMove - 1];

    // Moves compare
    if (
        (pcMove == 2 && moveP == "Rock") ||
        (pcMove == 3 && moveP == "Paper") ||
        (pcMove == 1 && moveP == "Scissors")
    ) {
        message += "<br>" + "*Sorry, You lose!*" + "<br>";
        score("cpu", "addPoint");
    } else if (moveP == moveNames[pcMove - 1]) {
        message += "<br>" + "*It`s a tie!*" + "<br>";
    } else {
        message += "<br>" + "*Congrats, You won!*" + "<br>";
        score("player", "addPoint");
    }

    outputMessages.innerHTML = message;
    gameProgress.roundNumber += 1;
    gameProgress.message = message;
    gameProgress.result = params.playerPoints + " - " + params.cpuPoints;
    params.progress.push({
        roundNumber: gameProgress.roundNumber,
        message: gameProgress.message,
        result: gameProgress.result
    });
    winTournament();
}

// Click move button
document.querySelectorAll(".player-move").forEach(playerMoveButton => {
    playerMoveButton.addEventListener("click", function () {
        let playerMoveName = playerMoveButton.getAttribute("data-move");
        playerMove(playerMoveName);
    });
});