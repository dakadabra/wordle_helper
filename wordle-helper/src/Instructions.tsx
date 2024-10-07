import React from 'react';
import "./App.css";

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
  };

  export default Instructions;