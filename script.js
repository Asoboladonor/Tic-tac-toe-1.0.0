document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const restartBtn = document.getElementById("restart-btn");
    const playerScore = document.getElementById("player-score");
    const computerScore = document.getElementById("computer-score");
    const draws = document.getElementById("draws");
    const difficultySelector = document.getElementById("difficulty");
    const helpBtn = document.getElementById("help-btn");
    const modal = document.getElementById("help-modal");
    const closeBtn = document.querySelector(".close-btn");
    const gameOverModal = document.getElementById("game-over-modal");
    const gameOverMessage = document.getElementById("game-over-message");
    const closeGameOverBtn = document.getElementById("close-game-over");
    const gameMessage = document.getElementById("game-message");

    let board = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let isGameActive = true;
    let difficulty = "easy";

    const loadScores = () => {
        playerScore.textContent = localStorage.getItem("playerWins") || 0;
        computerScore.textContent = localStorage.getItem("computerWins") || 0;
        draws.textContent = localStorage.getItem("draws") || 0;
    };

    const saveScores = () => {
        localStorage.setItem("playerWins", playerScore.textContent);
        localStorage.setItem("computerWins", computerScore.textContent);
        localStorage.setItem("draws", draws.textContent);
    };

    const messages = {
        start: [
            "Let's play! You're X.", 
            "Ready to crush the computer?",
            "3 in a row wins!",
            "Watch out for the AI!",
            "Pro tip: Hard mode is unbeatable!"
        ],
        playerTurn: [
            "Your turn!", 
            "Make your move!",
            "Where to next?",
            "Think carefully...",
            "Show 'em who's boss!"
        ],
        computerTurn: [
            "Computer is thinking...", 
            "AI's turn!",
            "Calculating...",
            "The machine is plotting...",
            "Watch out!"
        ],
        win: [
            "You crushed it! 🎉", 
            "Victory! 🏆",
            "AI didn't stand a chance!",
            "Winner winner! 🍗",
            "Flawless! ✨"
        ],
        lose: [
            "AI outsmarted you... 😅", 
            "Better luck next time!",
            "The machines win this round.",
            "Oof, tough loss.",
            "AI: 1, You: 0"
        ],
        draw: [
            "It's a tie! 🤝", 
            "Stalemate!",
            "No winner this time.",
            "Equal match!",
            "Try again!"
        ]
    };

    const getRandomMessage = (type) => {
        return messages[type][Math.floor(Math.random() * messages[type].length)];
    };

    const updateGameMessage = (type) => {
        gameMessage.textContent = getRandomMessage(type);
    };

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]             
    ];

    const checkWin = (board, player) => {
        return winningConditions.some(condition => 
            condition.every(index => board[index] === player)
        );
    };

    const findStrategicMove = (player) => {
        for (const [a, b, c] of winningConditions) {
            if (board[a] === player && board[b] === player && board[c] === "") return c;
            if (board[a] === player && board[c] === player && board[b] === "") return b;
            if (board[b] === player && board[c] === player && board[a] === "") return a;
        }
        return null;
    };

    const minimax = (board, player) => {
        const availableSpots = board.map((cell, index) => cell === "" ? index : null).filter(val => val !== null);

        if (checkWin(board, "X")) return { score: -10 };
        if (checkWin(board, "O")) return { score: 10 };
        if (availableSpots.length === 0) return { score: 0 };

        const moves = [];
        for (const spot of availableSpots) {
            const move = { index: spot };
            board[spot] = player;
            move.score = minimax(board, player === "O" ? "X" : "O").score;
            board[spot] = "";
            moves.push(move);
        }

        return player === "O" 
            ? moves.reduce((best, move) => move.score > best.score ? move : best, { score: -Infinity })
            : moves.reduce((best, move) => move.score < best.score ? move : best, { score: Infinity });
    };

    const computerMove = () => {
        switch (difficulty) {
            case "easy":
                const emptyCells = board.map((cell, index) => cell === "" ? index : null).filter(val => val !== null);
                return emptyCells[Math.floor(Math.random() * emptyCells.length)];
            
            case "medium":
                return findStrategicMove("O") || findStrategicMove("X") || 
                       Math.random() > 0.3 ? computerMove() : null;
            
            case "hard":
                return minimax(board, "O").index;
        }
    };

    const highlightWinningCells = (winningCombo) => {
        winningCombo.forEach(index => cells[index].classList.add("win"));
    };

    const checkGameStatus = () => {
        for (const [a, b, c] of winningConditions) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                highlightWinningCells([a, b, c]);
                isGameActive = false;
                
                if (currentPlayer === "X") {
                    playerScore.textContent = parseInt(playerScore.textContent) + 1;
                    updateGameMessage("win");
                    showGameOver(getRandomMessage("win"));
                } else {
                    computerScore.textContent = parseInt(computerScore.textContent) + 1;
                    updateGameMessage("lose");
                    showGameOver(getRandomMessage("lose"));
                }
                saveScores();
                return;
            }
        }

        if (!board.includes("")) {
            isGameActive = false;
            draws.textContent = parseInt(draws.textContent) + 1;
            updateGameMessage("draw");
            showGameOver(getRandomMessage("draw"));
            saveScores();
        }
    };

    const handleCellClick = (e) => {
        const cell = e.target;
        const index = cell.getAttribute("data-index");

        if (board[index] === "" && isGameActive) {
            cell.textContent = currentPlayer;
            board[index] = currentPlayer;
            checkGameStatus();

            if (isGameActive) {
                currentPlayer = "O";
                updateGameMessage("computerTurn");
                
                setTimeout(() => {
                    const computerIndex = computerMove();
                    if (computerIndex !== undefined && computerIndex !== null) {
                        board[computerIndex] = "O";
                        cells[computerIndex].textContent = "O";
                        checkGameStatus();
                    }
                    currentPlayer = "X";
                    updateGameMessage("playerTurn");
                }, 800);
            }
        }
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
        isGameActive = true;
        currentPlayer = "X";
        cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove("win");
        });
        updateGameMessage("start");
    };

    const showGameOver = (message) => {
        gameOverMessage.textContent = message;
        gameOverModal.style.display = "block";
    };

    cells.forEach(cell => cell.addEventListener("click", handleCellClick));
    restartBtn.addEventListener("click", resetBoard);
    helpBtn.addEventListener("click", () => modal.style.display = "block");
    closeBtn.addEventListener("click", () => modal.style.display = "none");
    closeGameOverBtn.addEventListener("click", () => {
        gameOverModal.style.display = "none";
        resetBoard();
    });
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
        if (e.target === gameOverModal) gameOverModal.style.display = "none";
    });
    difficultySelector.addEventListener("change", (e) => {
        difficulty = e.target.value;
        resetBoard();
    });

    loadScores();
    updateGameMessage("start");
});
                
