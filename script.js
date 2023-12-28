document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('board');
  const rows = 10;
  const cols = 10;
  const totalMines = 15;
  let minesweeperBoard = [];

  function createBoard() {
      for (let i = 0; i < rows; i++) {
          minesweeperBoard[i] = [];
          for (let j = 0; j < cols; j++) {
              const cell = document.createElement('div');
              cell.classList.add('cell');
              cell.dataset.row = i;
              cell.dataset.col = j;
              cell.addEventListener('click', handleClick);
              cell.addEventListener('contextmenu', handleRightClick);
              board.appendChild(cell);
              minesweeperBoard[i][j] = {
                  isMine: false,
                  count: 0,
                  isRevealed: false,
                  isFlagged: false,
                  element: cell
              };
          }
      }
      placeMines();
      calculateAdjacentCounts();
  }

  function placeMines() {
      let minesPlaced = 0;
      while (minesPlaced < totalMines) {
          const randomRow = Math.floor(Math.random() * rows);
          const randomCol = Math.floor(Math.random() * cols);
          if (!minesweeperBoard[randomRow][randomCol].isMine) {
              minesweeperBoard[randomRow][randomCol].isMine = true;
              minesPlaced++;
          }
      }
  }

  function calculateAdjacentCounts() {
      for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
              if (!minesweeperBoard[i][j].isMine) {
                  minesweeperBoard[i][j].count = countAdjacentMines(i, j);
              }
          }
      }
  }

  function countAdjacentMines(row, col) {
      let count = 0;
      for (let i = Math.max(0, row - 1); i <= Math.min(rows - 1, row + 1); i++) {
          for (let j = Math.max(0, col - 1); j <= Math.min(cols - 1, col + 1); j++) {
              if (minesweeperBoard[i][j].isMine) {
                  count++;
              }
          }
      }
      return count;
  }

  function handleClick(event) {
      const cell = event.target;
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);

      if (event.ctrlKey) {
          handleRightClick(event);
      } else if (!minesweeperBoard[row][col].isFlagged) {
          if (minesweeperBoard[row][col].isMine) {
              revealBoard();
              showResultMessage('¡Has perdido! Intenta de nuevo.');
          } else {
              revealCell(row, col);
              if (checkWin()) {
                  showResultMessage('¡Felicidades! ¡Has ganado!');
              }
          }
      }
  }

  function handleRightClick(event) {
      event.preventDefault();
      const cell = event.target;
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);

      if (!minesweeperBoard[row][col].isRevealed) {
          minesweeperBoard[row][col].isFlagged = !minesweeperBoard[row][col].isFlagged;
          cell.classList.toggle('flagged', minesweeperBoard[row][col].isFlagged);
          cell.textContent = minesweeperBoard[row][col].isFlagged ? '🚩' : '';
      }
  }

  function revealCell(row, col) {
      const cell = minesweeperBoard[row][col].element;
      if (!minesweeperBoard[row][col].isRevealed) {
          minesweeperBoard[row][col].isRevealed = true;
          cell.classList.add('clicked');
          if (minesweeperBoard[row][col].count > 0) {
              cell.textContent = minesweeperBoard[row][col].count;
          } else {
              for (let i = Math.max(0, row - 1); i <= Math.min(rows - 1, row + 1); i++) {
                  for (let j = Math.max(0, col - 1); j <= Math.min(cols - 1, col + 1); j++) {
                      revealCell(i, j);
                  }
              }
          }
      }
  }

  function revealBoard() {
      for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
              const cell = minesweeperBoard[i][j].element;
              cell.classList.add('clicked');
              if (minesweeperBoard[i][j].isMine) {
                  cell.classList.add('mine');
                  cell.textContent = '💥';
              } else if (minesweeperBoard[i][j].count > 0) {
                  cell.textContent = minesweeperBoard[i][j].count;
              }
          }
      }
      document.getElementById('emoji').textContent = '😢'; // Carita triste al perder
  }

  function checkWin() {
      for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
              if (!minesweeperBoard[i][j].isMine && !minesweeperBoard[i][j].isRevealed) {
                  return false;
              }
          }
      }
      return true;
  }

  function showResultMessage(message) {
      const resultMessage = document.getElementById('result-message');
      resultMessage.textContent = message;
      const modal = document.getElementById('modal');
      modal.style.display = 'block';
  }

  function hideModal() {
      const modal = document.getElementById('modal');
      modal.style.display = 'none';
  }

  function handlePlayAgain() {
      hideModal();
      resetGame();
  }

  function resetGame() {
      board.innerHTML = '';
      minesweeperBoard = [];
      document.getElementById('emoji').textContent = '😊'; // Carita feliz al reiniciar
      createBoard();
  }

  const playAgainBtn = document.getElementById('play-again-btn');
  playAgainBtn.addEventListener('click', handlePlayAgain);

  createBoard();
});
