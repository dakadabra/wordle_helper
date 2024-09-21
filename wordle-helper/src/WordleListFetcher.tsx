// Code taken from https://gist.github.com/iancward/afe148f28c5767d5ced7a275c12816a3

import React, { useState, useEffect } from 'react';

const MAX_COLUMNS = 10;
const MAX_ROWS = 50;

const WordleListFetcher = ({greys, yellows, greens, onWordSelect}) => {
  const [words, setWords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function filterWords(wordList: string[]) {
    let filteredList = wordList;
    for (let i = 0; i < 5; i++) { // for each letter in the word
      if (greens[i] !== "") {
        filteredList = filteredList.filter(word => word[i] === greens[i]);
      }
      if (yellows[i] !== "") {
        for (let j = 0; j < yellows[i].length; j++) {
          filteredList = filteredList.filter(word => {
            const yellowLetter = yellows[i][j];
            const yellowCount = yellows.flat().filter(l => l === yellowLetter).length;
            const greenCount = greens.filter(l => l === yellowLetter).length;
            const wordCount = word.split('').filter(l => l === yellowLetter).length;

            return word[i] !== yellowLetter && // Ensure the yellow letter is not at this position
                   wordCount >= yellowCount + greenCount; // Ensure the word has at least as many occurrences as yellows and greens combined
          });
        }
      }
      if (greys[i] !== "") {
        for (let j = 0; j < greys[i].length; j++) {
          // remove words that include the grey letter and don't already have the letter in the correct position
          filteredList = filteredList.filter(word => (word[i] !== greys[i][j]) &&
                                                      (!word.includes(greys[i][j]) ||
                                                      greens.includes(greys[i][j]) ||
                                                      yellows.some(col => col.includes(greys[i][j]))));
        }
      }
    }
    setWords(filteredList);
  }

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/tabatkins/wordle-list/main/words');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const wordList = text.split('\n').filter(word => word.trim() !== '');
        wordList.sort();
        filterWords(wordList);
      } catch (e) {
        setError('Failed to fetch the word list: ' + e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWords();
  }, [greys, yellows, greens]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p>Total possible words: {words.length}</p>
      <div className="word-columns" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        {Array.from({ length: Math.min(MAX_COLUMNS, words.length) }, (_, col) => (
          <div key={col} className="max-h-60 overflow-y-auto" style={{ flex: '0 1 auto', margin: '20px 10px', maxWidth: '200px' }}>
            {words.slice(0, MAX_ROWS * MAX_COLUMNS)
              .filter((_, index) => index % Math.min(MAX_COLUMNS, words.length) === col) // Distribute words across columns
              .map((word, index) => (
                <button
                  key={index}
                  onClick={() => onWordSelect(word)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px',
                    margin: '8px 0',
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontSize: '24px',
                    transition: 'background-color 0.3s',
                    minWidth: '0',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                >
                  {word}
                </button>
              ))}
          </div>
        ))}
      </div>
      {words.length > (MAX_COLUMNS * MAX_ROWS) && <p>... and {words.length - MAX_COLUMNS * MAX_ROWS} more words</p>}
    </div>
  );
};

export default WordleListFetcher;
