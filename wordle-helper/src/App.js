
// Filename - App.js
 
// Importing modules
import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import WordleListFetcher from './WordleListFetcher.tsx';

const SquareColors = {
    GREEN: 'green',
    YELLOW: 'yellow',
    GREY: 'grey',
};

const MAX_GUESSES = 6;
const NUM_LETTERS = 5;

function Square({ value, colIndex, rowIndex, updateSquareInfo, autoFocus, disabled }) {
    const inputRef = useRef(null)

    // Focus on the square when we open the app if it is the first square in the board
    useEffect(() => {
        if (autoFocus) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    // If the square is clicked, update the square color
    const handleClick = () => {
        if (value.letter !== "") {
            let newColor;
            if (value.color === SquareColors.GREEN) {
                newColor = SquareColors.GREY;
            } else if (value.color === SquareColors.YELLOW) {
                newColor = SquareColors.GREEN;
            } else {
                newColor = SquareColors.YELLOW;
            }
            updateSquareInfo(rowIndex, colIndex, value.letter.toLowerCase(), newColor);
        }
    }
    
    const handleChange = (event) => {
        const newLetter = event.target.value
        const lastChar = newLetter === "" ? "" : newLetter.slice(-1).toUpperCase();
    
        if (lastChar === "" || lastChar.match(/[A-Z]/i)) {
          updateSquareInfo(rowIndex, colIndex, lastChar.toLowerCase(), value.color);
          
          if (lastChar !== "") {
           // Focus next input or Enter button
            if (colIndex < 4) {
              const nextInput = inputRef.current.parentNode.nextSibling.querySelector('input');
              nextInput.focus();
            } else {
              const enterButton = inputRef.current.parentNode.parentNode.querySelector('button:last-child');
              // Wait for the enter button to be enabled before focusing
              setTimeout(() => {
                enterButton.focus();
              }, 100);
            }
          }
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Backspace' && value.letter === '') {
            if (colIndex > 0) {
                const prevInput = inputRef.current.parentNode.previousSibling.querySelector('input');
                prevInput.focus();
            }
        }
    };

    return (
      <button className={"square " + value.color} onClick={handleClick} disabled={disabled}>
        <input 
          ref={inputRef} 
          className="letter" 
          type="text" 
          value={value.letter.toUpperCase()} 
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
      </button>
    );
}

function Board({ squares, updateSquareInfo, onEnter, currentRow, setCurrentRow }) {
  const enterButtonRefs = useRef([]);
  const [rowsFilled, setRowsFilled] = useState(Array(MAX_GUESSES).fill(false));

  const handleEnter = (rowIndex) => {
    onEnter(rowIndex);
    setCurrentRow(rowIndex + 1);
    
    // Use setTimeout to ensure the next row is enabled before focusing
    setTimeout(() => {
      if (rowIndex < NUM_LETTERS) {
        const nextRow = enterButtonRefs.current[rowIndex].parentNode.nextSibling;
        const firstInput = nextRow.querySelector('input');
        firstInput.focus();
      }
    }, 0);
  }

  const checkRowFilled = (rowIndex) => {
    const row = squares.slice(rowIndex * NUM_LETTERS, (rowIndex + 1) * NUM_LETTERS);
    const isFilled = row.every(square => square.letter !== "");
    setRowsFilled(prev => {
      const newRowsFilled = [...prev];
      newRowsFilled[rowIndex] = isFilled;
      return newRowsFilled;
    });
  }

  useEffect(() => {
    checkRowFilled(currentRow);
  }, [squares, currentRow]);

  return (
    <>
      {Array.from({ length: MAX_GUESSES }, (_, i) => (
        <div className="board-row" key={i}>
          {Array.from({ length: NUM_LETTERS }, (_, j) => (
            <Square
              key={i * NUM_LETTERS + j}
              value={squares[i * NUM_LETTERS + j]}
              rowIndex={i}
              colIndex={j}
              updateSquareInfo={(rowIndex, colIndex, letter, color) => {
                updateSquareInfo(rowIndex, colIndex, letter, color);
                checkRowFilled(rowIndex);
              }}
              autoFocus={i === 0 && j === 0}
              disabled={i !== currentRow}
            />
          ))}
          <button 
            ref={el => enterButtonRefs.current[i] = el} 
            onClick={() => handleEnter(i)}
            disabled={i !== currentRow || !rowsFilled[i]}
            className="enter button"
          >
            Enter
          </button>
        </div>
      ))}
    </>
  );
}

function Instructions() {
  return (
    <div>
      <input type="checkbox" id="instructionsToggle" className="instructions-toggle"/>
      <div className="instructions-container">
        <label htmlFor="instructionsToggle" className="instructions-label">Instructions</label>
        <div className="instructions-content">
          <ol>
            <li>This tool is meant to be used in conjunction with the Wordle game on New York Times.</li>
            <li>
              <ol type="a">
                <li>After each guess you make on the Wordle app, enter it here.</li>
                <li>Alternatively, click on the word you guessed from the list to automatically fill it into the next empty row.</li>
              </ol>
            </li>
            <li>Click on each letter to cycle through colours (grey, yellow, green) based on Wordle's feedback.</li>
            <li>Press "Enter" after each word to update the list of possible words.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function RefreshButton({ onRefresh }) {
  return (
    <button 
      className="refresh-button"
      onClick={onRefresh}
    >
      Refresh
    </button>
  );
}

function App() {
    const [squares, setSquares] = useState(Array(30).fill().map(() => ({ letter: "", color: SquareColors.GREY })))
    const [yellowSquares, setYellowSquares] = useState(Array(NUM_LETTERS).fill().map(() => []))
    const [greenSquares, setGreenSquares] = useState(Array(NUM_LETTERS).fill(""))
    const [greySquares, setGreySquares] = useState(Array(NUM_LETTERS).fill().map(() => []))
    const [currentRow, setCurrentRow] = useState(0);

    // Updates the square info with the letter and color of the square
    const updateSquareInfo = (rowIndex, colIndex, letter, color) => {
        const newSquares = [...squares];
        newSquares[rowIndex * NUM_LETTERS + colIndex] = { letter, color };
        setSquares(newSquares);
    };

    // Updates the green, yellow, and grey squares with the letter and color of the square once the row is entered
    const handleEnter = (rowIndex) => {
        const rowInfo = squares.slice(rowIndex * NUM_LETTERS, (rowIndex + 1) * NUM_LETTERS);
        const newGreenSquares = [...greenSquares];
        const newYellowSquares = yellowSquares.map(arr => [...arr]); // Deep copy of yellowSquares
        const newGreySquares = greySquares.map(arr => [...arr]); // Deep copy of greySquares
        rowInfo.forEach(({ letter, color }, colIndex) => {
            if (color === SquareColors.GREEN) {
                newGreenSquares[colIndex] = letter; // Add letter to green squares in the correct position
                if (greenSquares[colIndex] !== letter) { // new green square, so remove occurences of the letter from yellows
                  newYellowSquares.some((yellowLettersAtThisSpot, _) => { // Removes occurence of the letter from yellows if it was part of previous guesses
                    if (yellowLettersAtThisSpot.includes(letter)) {
                        yellowLettersAtThisSpot.splice(yellowLettersAtThisSpot.indexOf(letter), 1);
                    }
                 });
              }
            } else if (color === SquareColors.YELLOW) {
              if (greenSquares.includes(letter)) {
                // Remove the letter from greenSquares, as we're using it as a counter (a person might have used it as a green guess before, and now moved it to a yellow positon)
                const index = greenSquares.indexOf(letter);
                if (index > -1) {
                  greenSquares[index] = '';
                }
              } else {
                // Add the letter to the right array in newYellowSquares
                if (!newYellowSquares[colIndex].includes(letter)) {
                  newYellowSquares[colIndex].push(letter);
                }
              }
            } else if (color === SquareColors.GREY) {
              if (!newGreySquares[colIndex].includes(letter)) { // If letter is not already in the grey squares at that position
                newGreySquares[colIndex].push(letter); // Add letter to grey squares in that position
              }
            }
        });

        setGreenSquares(newGreenSquares);
        setYellowSquares(newYellowSquares);
        setGreySquares(newGreySquares);
    };

    const handleWordSelect = (word) => {
        const newSquares = [...squares];
        word.split('').forEach((letter, index) => {
            newSquares[currentRow * NUM_LETTERS + index] = { letter: letter, color: SquareColors.GREY };
        });
        setSquares(newSquares);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Wordle Helper</h1>
                <h5>A tool to help you solve Wordle puzzles, showing a list of possible words as you go.</h5>
                <Instructions />
                <RefreshButton 
                    onRefresh={() => {
                        setSquares(Array(30).fill({ letter: '', color: SquareColors.GREY }));
                        setCurrentRow(0);
                        setGreenSquares(Array(NUM_LETTERS).fill(''));
                        setYellowSquares(Array(NUM_LETTERS).fill([]));
                        setGreySquares(Array(NUM_LETTERS).fill([]));
                    }}
                />
                <Board 
                    squares={squares} 
                    updateSquareInfo={updateSquareInfo}
                    onEnter={handleEnter}
                    currentRow={currentRow}
                    setCurrentRow={setCurrentRow}
                />
                <WordleListFetcher
                    greys={greySquares} 
                    yellows={yellowSquares} 
                    greens={greenSquares}
                    onWordSelect={handleWordSelect}
                />
            </header>
        </div>
    );
}
 
export default App;