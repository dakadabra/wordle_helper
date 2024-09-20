
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

function Square({ value, squareColor, colIndex, rowIndex, updateSquareInfo, autoFocus, disabled }) {
    const [letter, setLetter] = useState(value)
    const [color, setColor] = useState(squareColor)
    const inputRef = useRef(null)

    // Focus on the square when we open the app if it is the first square in the board
    useEffect(() => {
        if (autoFocus) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    // If the square is clicked, update the square color
    const handleClick = () => {
        if (letter !== "") {
            let newColor;
            if (color === SquareColors.GREEN) {
                newColor = SquareColors.GREY;
            } else if (color === SquareColors.YELLOW) {
                newColor = SquareColors.GREEN;
            } else {
                newColor = SquareColors.YELLOW;
            }
            setColor(newColor);
            updateSquareInfo(rowIndex, colIndex, letter.toLowerCase(), newColor);
        }
    }
    
    const handleChange = (event) => {
        const newLetter = event.target.value
        const lastChar = newLetter === "" ? "" : newLetter.slice(-1).toUpperCase();
    
        if (lastChar === "" || lastChar.match(/[A-Z]/i)) {
          setLetter(lastChar);
          updateSquareInfo(rowIndex, colIndex, lastChar.toLowerCase(), color);
          
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
        if (event.key === 'Backspace' && letter === '') {
            if (colIndex > 0) {
                const prevInput = inputRef.current.parentNode.previousSibling.querySelector('input');
                prevInput.focus();
            }
        }
    };

    return (
      <button className={"square " + color} onClick={handleClick} disabled={disabled}>
        <input 
          ref={inputRef} 
          className="letter" 
          type="text" 
          value={letter} 
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
      </button>
    );
}

function Board({ squares, updateSquareInfo, onEnter }) {
  const enterButtonRefs = useRef([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [rowsFilled, setRowsFilled] = useState(Array(6).fill(false));

  const handleEnter = (rowIndex) => {
    onEnter(rowIndex);
    setCurrentRow(rowIndex + 1);
    
    // Use setTimeout to ensure the next row is enabled before focusing
    setTimeout(() => {
      if (rowIndex < 5) {
        const nextRow = enterButtonRefs.current[rowIndex].parentNode.nextSibling;
        const firstInput = nextRow.querySelector('input');
        firstInput.focus();
      }
    }, 0);
  }

  const checkRowFilled = (rowIndex) => {
    const row = squares.slice(rowIndex * 5, (rowIndex + 1) * 5);
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
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div className="board-row" key={i}>
          {[0, 1, 2, 3, 4].map((j) => (
            <Square
              key={i * 5 + j}
              value={squares[i * 5 + j].letter}
              squareColor={squares[i * 5 + j].color}
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
          >
            Enter
          </button>
        </div>
      ))}
    </>
  );
}

function App() {
    const [squares, setSquares] = useState(Array(30).fill().map(() => ({ letter: "", color: SquareColors.GREY })))
    const [yellowSquares, setYellowSquares] = useState(Array(5).fill().map(() => []))
    const [greenSquares, setGreenSquares] = useState(Array(5).fill(""))
    const [greySquares, setGreySquares] = useState(Array(5).fill().map(() => []))

    useEffect(() => {
    }, [greenSquares, yellowSquares, greySquares]);

    // Updates the square info with the letter and color of the square
    const updateSquareInfo = (rowIndex, colIndex, letter, color) => {
        const newSquares = [...squares];
        newSquares[rowIndex * 5 + colIndex] = { letter, color };
        setSquares(newSquares);
    };

    // Updates the green, yellow, and grey squares with the letter and color of the square once the row is entered
    const handleEnter = (rowIndex) => {
        const rowInfo = squares.slice(rowIndex * 5, (rowIndex + 1) * 5);
        const newGreenSquares = [...greenSquares];
        const newYellowSquares = [...yellowSquares];
        const newGreySquares = [...greySquares];
        rowInfo.forEach(({ letter, color }, colIndex) => {
            if (color === SquareColors.GREEN) {
                newGreenSquares[colIndex] = letter; // Add letter to green squares in the correct position
                if (greenSquares[colIndex] !== letter) { // new green square, so remove one occurence of the letter from yellows
                  newYellowSquares.some((yellowLetters, i) => {
                    if (yellowLetters.includes(letter)) {
                        yellowLetters.splice(yellowLetters.indexOf(letter), 1);
                        return true;
                    }
                 });
              }
            } else if (color === SquareColors.YELLOW) {
              if (!newYellowSquares[colIndex].includes(letter)) { // If letter is not already in the yellow squares at that position
                newYellowSquares[colIndex].push(letter); // Add letter to yellow squares in that position
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

    return (
        <div className="App">
            <header className="App-header">
                <h1>Wordle Helper</h1>
                <Board 
                    squares={squares} 
                    updateSquareInfo={updateSquareInfo}
                    onEnter={handleEnter}
                />
                <WordleListFetcher
                    greys={greySquares} 
                    yellows={yellowSquares} 
                    greens={greenSquares}
                />
            </header>
        </div>
    );
}
 
export default App;