
// Filename - App.js
 
// Importing modules
import React, { useState, useEffect } from "react";
import "./App.css";
import WordleListFetcher from './WordleListFetcher.tsx';

const SquareColors = {
    GREEN: 'green',
    YELLOW: 'yellow',
    GREY: 'grey',
};

function Square({ value, squareColor, colIndex, rowIndex, updateSquareInfo }) {
    const [letter, setLetter] = useState(value)
    const [color, setColor] = useState(squareColor)

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
        }
    };

    return (
      <button className={"square " + color} onClick={handleClick}>
        <input className="letter" type="text" value={letter} onChange={handleChange} />
      </button>
    );
}

function Board({ squares, updateSquareInfo, onEnter }) {
    return (
      <>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div className="board-row" key={i}>
            {[0, 1, 2, 3, 4].map((j) => (
              <Square
                key={i * 5 + j}
                value={squares[i * 5 + j]}
                squareColor={SquareColors.GREY}
                rowIndex={i}
                colIndex={j}
                updateSquareInfo={updateSquareInfo}
              />
            ))}
            <button onClick={() => onEnter(i)}>Enter</button>
          </div>
        ))}
      </>
    );
}

function App() {
    const [squares, setSquares] = useState(Array(30).fill(""))
    const [tempSquareInfo, setTempSquareInfo] = useState(Array(6).fill().map(() => Array(5).fill({ letter: "", color: SquareColors.GREY })))
    const [yellowSquares, setYellowSquares] = useState(Array(5).fill().map(() => []))
    const [greenSquares, setGreenSquares] = useState(Array(5).fill(""))
    const [greySquares, setGreySquares] = useState(Array(5).fill().map(() => []))

    useEffect(() => {
    }, [greenSquares, yellowSquares, greySquares]);

    // Updates the temporary square info with the letter and color of the square
    const updateSquareInfo = (rowIndex, colIndex, letter, color) => {
        const newTempSquareInfo = [...tempSquareInfo];
        newTempSquareInfo[rowIndex][colIndex] = { letter, color };
        setTempSquareInfo(newTempSquareInfo);
    };

    // Updates the green, yellow, and grey squares with the letter and color of the square ones the row is entered
    const handleEnter = (rowIndex) => {
        const rowInfo = tempSquareInfo[rowIndex];
        const newGreenSquares = [...greenSquares];
        const newYellowSquares = [...yellowSquares];
        const newGreySquares = [...greySquares];
        rowInfo.forEach(({ letter, color }, colIndex) => {
            if (color === SquareColors.GREEN) {
                newGreenSquares[colIndex] = letter; // Add letter to green squares in the correct position
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