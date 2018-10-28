
let gameBoard;
let player_1 = "";
let player_2 = "";
const winOptions = [[0,1,2], [3,4,5], [6,7,8], [0,4,8], [2,4,6], [0,3,6], [1,4,7], [2,5,8]];
const cells = document.querySelectorAll(".cell");
function startGame(value) {
  if (value === "X") 
  {
    player_1 = "X";
    player_2 = "O";
  } 
  else 
  {
    player_1 = "O";
    player_2 = "X";
  }
  document.querySelector(".chooseMark").style.display = "none";
  document.querySelector(".endGame").style.display = "none";
  gameBoard = Array.from(Array(9).keys());
  for (let i = 0; i < cells.length; i++) 
  {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", takeTurn, false);
  }
}
function replay() 
{
  document.querySelector(".chooseMark").style.display = "block";
  document.querySelector(".endGame").style.display = "none";
}
function takeTurn(square) 
{
  if (typeof gameBoard[square.target.id] === "number") {
    cellSelection(square.target.id, player_1);
    if (!checkTie()) cellSelection(bestSpot(), player_2);
  }
}
function cellSelection(squareId, player) 
{
  gameBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let winner = verifyBoard(gameBoard, player);
  if (winner) 
  {
    gameOver(winner);
  }
}
function verifyBoard(board, player) 
{
  let marks = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let winner = null;
  for (let [index, win] of winOptions.entries()) {
    if (win.every(elem => marks.indexOf(elem) > -1)) 
    {
      winner = { index: index, player: player };
      break;
    }
  }
  return winner;
}
function gameOver(winner) 
{
  for (let index of winOptions[winner.index]) 
  {
    document.getElementById(index).style.backgroundColor = winner.player === player_1 ? "yellow" : "blue";
  }
  for (let i = 0; i < cells.length; i++) 
  {
    cells[i].removeEventListener("click", takeTurn, false);
  }
  declareWinner(winner.player === player_1 ? "You Win!" : "You Lose!");
}
function declareWinner(player) 
{
  document.querySelector(".endGame").style.display = "block";
  document.querySelector(".endGame .text").innerText = player;
  document.querySelector("#replay").style.visibility = "visible";
}
function emptySquares() 
{
  return gameBoard.filter(c => typeof c === "number");
}
function bestSpot() 
{
  return minimax(gameBoard, player_2).index;
}
function checkTie() 
{
  if (emptySquares().length === 0) 
  {
    for (let i = 0; i < cells.length; i++) 
    {
      cells[i].style.backgroundColor = "green";
      cells[i].removeEventListener("click", takeTurn, false);
    }
    declareWinner("Tie Game!");
    return true;
  }
  return false;
}
function minimax(newBoard, player) 
{
  var availSpots = emptySquares(newBoard);

  if (verifyBoard(newBoard, player_1)) 
  {
    return { score: -10 };
  } else if (verifyBoard(newBoard, player_2)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  var moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player === player_2)
    {
      let aiResult = minimax(newBoard, player_1);
      move.score = aiResult.score;
    } 
    else 
    {
      let result = minimax(newBoard, player_2);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }
  let bestMove;
  if (player === player_2) {
    let ptbestScore = -10000;
    for (var j = 0; j < moves.length; j++) {
      if (moves[j].score > ptbestScore) {
        ptbestScore = moves[j].score;
        bestMove = j;
      }
    }
  } 
  else {
    let bestScore = 10000;
    for (var x = 0; x < moves.length; x++) 
    {
      if (moves[x].score < bestScore) 
      {
        bestScore = moves[x].score;
        bestMove = x;
      }
    }
  }
  return moves[bestMove];
}
