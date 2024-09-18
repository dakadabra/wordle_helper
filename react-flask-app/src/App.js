
// Filename - App.js
 
// Importing modules
import React, { useState, useEffect } from "react";
import "./App.css";
import WordleListFetcher from './WordleListFetcher.tsx';

const SquareColors = {
    GREEN: 'green',
    YELLOW: 'yellow',
    GREY: 'grey'
};

function Square({ value, onSquareClick, squareColor }) {
    const [letter, setLetter] = useState(value);
    
    const handleChange = (event) => {
        const newLetter = event.target.value
        const lastChar = newLetter.slice(-1).toUpperCase();
    
        // Check if the last character is a letter
        if (lastChar.match(/[A-Z]/i)) {
          setLetter(lastChar);
        }
    };

    return (
      <button className={"square " + squareColor} onClick={onSquareClick}>
        <input className="letter" type="text" value={letter} onChange={handleChange} />
      </button>
    );
}

function Board({ squares }) {
  
    return (
      <>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div className="board-row">
            {[0, 1, 2, 3, 4].map((j) => (
              <Square
                value={squares[i * 6 + j]}
                onSquareClick={() => {}}
                squareColor={SquareColors.GREY}
              />
            ))}
          </div>
        ))}
      </>
    );
  }

function App() {
    const [words, setWords] = useState(null)
    const [squares, setSquares] = useState(Array(30).fill(null))
 
    useEffect(() => {
        fetch('https://raw.githubusercontent.com/tabatkins/wordle-list/main/words')
          .then(response => response.json())
          .then(data => setWords(data))
          .catch(error => console.error(error));
      }, []);
 
    return (
        <div className="App">
            <header className="App-header">
                <h1>Wordle Helper</h1>
                <Board squares={squares}/>
                <WordleListFetcher />
            </header>
        </div>
    );
}
 
export default App;