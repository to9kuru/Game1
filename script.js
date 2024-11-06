const board = Array(9).fill(null);
let currentPlayer = "〇";
let playerMoves = { "〇": [], "×": [] };
const maxMoves = 3;
const cells = document.querySelectorAll(".cell");
const status = document.getElementById("status");
const restartBtn = document.getElementById("restart-btn");

let clickDisabled = false;

cells.forEach(cell => {
    cell.addEventListener("click", handleMove);
});

restartBtn.addEventListener("click", resetGame);

function handleMove(event) {
    if (clickDisabled) return;
    clickDisabled = true;

    const index = event.target.dataset.index;

    if (board[index] !== null) {
        clickDisabled = false;
        return;
    }

    // 新しいマークを配置
    board[index] = currentPlayer;
    playerMoves[currentPlayer].push(index);

    const img = document.createElement("img");
    img.src = currentPlayer === "〇" ? "o.svg" : "x.svg";
    img.classList.add(currentPlayer === "〇" ? "circle" : "cross");
    event.target.appendChild(img);

    // 相手の3つ目のマークが置かれたら、その1つ目にアニメーションを追加
    const opponent = currentPlayer === "〇" ? "×" : "〇";
    if (playerMoves[opponent].length === maxMoves) {
        cells.forEach(cell => cell.firstChild?.classList.remove("pulse"));
        const opponentFirstMove = playerMoves[opponent][0];
        if (opponentFirstMove !== undefined && cells[opponentFirstMove].firstChild) {
            cells[opponentFirstMove].firstChild.classList.add("pulse");
        }
    }

    // 古いマークの削除処理（最大数を超えた場合）
    if (playerMoves[currentPlayer].length > maxMoves) {
        const oldestMove = playerMoves[currentPlayer].shift();
        const oldestCell = cells[oldestMove];

        if (oldestCell.firstChild) {
            oldestCell.firstChild.classList.add("fade-out");
        }

        setTimeout(() => {
            board[oldestMove] = null;
            oldestCell.innerHTML = "";
        }, 500);
    }

    // 勝利判定と次のターンの準備
    setTimeout(() => {
        if (checkWin()) {
            status.textContent = `${currentPlayer}の勝ち！`;
            cells.forEach(cell => cell.removeEventListener("click", handleMove));
        } else if (board.every(cell => cell !== null)) {
            status.textContent = "引き分けです！";
        } else {
            currentPlayer = currentPlayer === "〇" ? "×" : "〇";
            status.textContent = `${currentPlayer}の番です`;
            clickDisabled = false;
        }
    }, 500);
}

function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const winningPattern = winPatterns.find(pattern => 
        pattern.every(index => board[index] === currentPlayer)
    );

    if (winningPattern) {
        winningPattern.forEach(index => {
            const cell = cells[index];
            cell.classList.add("win");
            // 勝者に応じた背景色を変更
            cell.style.backgroundColor = currentPlayer === "〇" ? "rgba(255, 0, 0, 0.3)" : "rgba(0, 0, 255, 0.3)";
        });
        return true;
    }
    return false;
}


function resetGame() {
    board.fill(null);
    playerMoves = { "〇": [], "×": [] };
    cells.forEach(cell => {
        cell.innerHTML = "";
        cell.classList.remove("win"); // 勝利のスタイルをリセット
        cell.style.backgroundColor = "#333"; // 背景色をデフォルトに戻す
        cell.style.boxShadow = ""; // 影もリセット
        cell.firstChild?.classList.remove("pulse");
    });
    currentPlayer = "〇";
    status.textContent = "〇の番です";
    clickDisabled = false;
    cells.forEach(cell => cell.addEventListener("click", handleMove));
}
