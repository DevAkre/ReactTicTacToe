import './App.css';
import { useState } from 'react';
function Square({value, onSquareClick,isHighLighted}) {
  return (
    <button className={isHighLighted?"square highlight":"square"} onClick={onSquareClick}>
      {value}
    </button>
  )
}

function Board({xIsNext, squares, onPlay}) {

  function handleClick(i) {
    if(squares[i] || calculateWinner(squares)[0]) return;
    const nextSquares = squares.slice();
    xIsNext? nextSquares[i] = 'X' : nextSquares[i] = 'O';
    onPlay(nextSquares);
  }

  const result = calculateWinner(squares);
  let status;
  if(result[0]){
    status = "Winner:" + result[0];
  }else if(!squares.includes(null)){
    status = "Draw";
  }else{
    status = "Next Player: " + (xIsNext? 'X':'O');
  }

  
  const board = [...Array(3)].map((x, i) =>
    <div className="board-row" key={i}>
      {[...Array(3)].map((x, j) =>
        <Square value={squares[3*i+j]} onSquareClick={() => handleClick(3*i+j)} isHighLighted={result[1].includes(3*i+j)} key= {3*i+j} />
    )}
    </div>
  )

  return (
    <>
      <div className = "status"> {status}</div>
      <div className = "board">
        {board}
      </div>
    </>
    );
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [squares[a],lines[i]];
      }
    }
    return [null,[]];
  }

export default function Game() {
  const [history,setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isAscending, setIsAscending] = useState(true);

  function handlePlay(nextSquares){
    const nextHistory = [...history.slice(0,currentMove+1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  
  function historyMap(move){
      let description;
      if(move === currentMove){
        description = 'You are at move #' + currentMove;
        return (
        <li className="current-move" key = {move}>
          {description}
        </li>
        )
      }
      if (move > 0) {
        description = 'Go to move #' + move;
        const newMove = history[move].findIndex((x,i) => x !== history[move-1][i])
        description += ' (' + history[move][newMove] + ':' + (newMove % 3 + 1) + ',' + (Math.trunc(newMove/ 3) + 1) + ')';
      } else {
        description = 'Go to game start';
      }
      return (
        <li className="menu-btn" key = {move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
  }

  const moves = isAscending?history.map((squares, move ) => historyMap(move)):history.map((squares, move ) => historyMap(history.length - 1 - move));

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares = {currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <div>
          Sort by: 
          <button onClick={() => setIsAscending(!isAscending)}>{isAscending? 'Ascending' : 'Descending'}</button>
        </div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}