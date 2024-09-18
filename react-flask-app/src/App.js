
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
    const [letter, setLetter] = useState(value)
    const [color, setColor] = useState(squareColor)

    const handleClick = () => {
        // Only allow colour to change if there's a letter there
        if (letter != "") {
            // Users can update the value of the square based on what they see on the app
            if (color == SquareColors.GREEN) {
                setColor(SquareColors.GREY)
            } else if (color == SquareColors.GREY) {
                setColor(SquareColors.YELLOW)
            } else {
                setColor(SquareColors.GREEN)
            }
            // If there is a letter there, update the list possible words with the new info
            onSquareClick(color)
        }
    }
    
    const handleChange = (event) => {
        const newLetter = event.target.value
        const lastChar = newLetter == "" ? "" : newLetter.slice(-1).toUpperCase();
    
        // Check if the last character is a letter
        if (lastChar == "" || lastChar.match(/[A-Z]/i)) {
          setLetter(lastChar);
        }
    };

    return (
      <button className={"square " + color} onClick={handleClick}>
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
            <button>Enter</button> {/*TODO: Add key bindings here too*/}
          </div>
        ))}
      </>
    );
  }

function App() {
    const [words, setWords] = useState(null)
    const [squares, setSquares] = useState(Array(30).fill(""))
 
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