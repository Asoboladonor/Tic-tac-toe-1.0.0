document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const restartBtn = document.getElementById("restart-btn");
    const playerScore = document.getElementById("player-score");
    const computerScore = document.getElementById("computer-score");
    const draws = document.getElementById("draws");
    const difficultySelector = document.getElementById("difficulty");

    let board = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let isGameActive = true;
    let difficulty = "easy"; // Default difficulty

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    // Update difficulty when the selector changes
    difficultySelector.addEventListener("change", (e) => {
        difficulty = e.target.value;
    });

    const computerMove = () => {
        if (difficulty === "easy") {
            // Random move for easy difficulty
            const emptyCells = board.map((value, index) => (value === "" ? index : null)).filter((val) => val !== null);
            if (emptyCells.length === 0) return undefined;
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            return emptyCells[randomIndex];
        } else if (difficulty === "hard") {
            // Prioritize winning or blocking moves for hard difficulty
            for (let [a, b, c] of winningConditions) {
                // Check if the computer can win
                if (board[a] === "O" && board[b] === "O" && board[c] === "") return c;
                if (board[a] === "O" && board[c] === "O" && board[b] === "") return b;
                if (board[b] === "O" && board[c] === "O" && board[a] === "") return a;

                // Check if the computer needs to block the player
                if (board[a] === "X" && board[b] === "X" && board[c] === "") return c;
                if (board[a] === "X" && board[c] === "X" && board[b] === "") return b;
                if (board[b] === "X" && board[c] === "X" && board[a] === "") return a;
            }

            // If no immediate win or block, pick a random move
            const emptyCells = board.map((value, index) => (value === "" ? index : null)).filter((val) => val !== null);
            if (emptyCells.length === 0) return undefined;
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            return emptyCells[randomIndex];
        }
    };

    const updateBoard = (index) => {
        board[index] = currentPlayer;
    };

    const checkWinner = () => {
        let roundWon = false;

        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            if (currentPlayer === "X") {
                playerScore.textContent = parseInt(playerScore.textContent) + 1;
            } else {
                computerScore.textContent = parseInt(computerScore.textContent) + 1;
            }
            isGameActive = false;
        } else if (!board.includes("")) {
            draws.textContent = parseInt(draws.textContent) + 1;
            isGameActive = false;
        }

        if (!isGameActive) {
            setTimeout(resetBoard, 2000);
        }
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
        isGameActive = true;
        currentPlayer = "X";
        cells.forEach((cell) => {
            cell.textContent = "";
            cell.classList.remove("win");
        });
    };

    const handleClick = (e) => {
        const cell = e.target;
        const index = cell.getAttribute("data-index");

        if (board[index] === "" && isGameActive) {
            cell.textContent = currentPlayer;
            updateBoard(index);
            checkWinner();

            if (isGameActive) {
                currentPlayer = "O";
                const computerIndex = computerMove();
                if (computerIndex !== undefined) {
                    board[computerIndex] = "O";
                    cells[computerIndex].textContent = "O";
                    checkWinner();
                }
                currentPlayer = "X";
            }
        }
    };

    cells.forEach((cell) => {
        cell.addEventListener("click", handleClick);
    });

    restartBtn.addEventListener("click", resetBoard);

    // Modal functionality
    const helpBtn = document.getElementById("help-btn");
    const modal = document.getElementById("help-modal");
    const closeBtn = document.querySelector(".close-btn");

    helpBtn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});