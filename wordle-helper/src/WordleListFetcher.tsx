// Code inspired by https://gist.github.com/iancward/afe148f28c5767d5ced7a275c12816a3

import React, { useState, useEffect } from 'react';
import './WordleListFetcher.css';
import wordListWithFreqs from './word_freq_data/filtered_words.json';

const MAX_COLUMNS = 10;
const MIN_COLUMNS = 1;
const MAX_ROWS = 50;

const WordleListFetcher = ({greys, yellows, greens, onWordSelect}) => {
  const [words, setWords] = useState<string[]>([]);
  const [filteredWords, setFilteredWords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [columns, setColumns] = useState(MAX_COLUMNS);
  const [searchTerm, setSearchTerm] = useState('');

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
            const yellowCount = yellows.flat().includes(yellowLetter) ? 1 : 0;
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
    setFilteredWords(filteredList);
  }

  useEffect(() => {
    const loadWords = async () => {
      try {
        /* This approach was replaced with a list of words sorted by frequency in English */
        // const response = await fetch('https://raw.githubusercontent.com/tabatkins/wordle-list/main/words');
        // const response = await fetch('./src/word_freq_data/filtered_words.txt');
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }
        // const text = await response.text();
        // const wordList = text.split('\n').filter(word => word.trim() !== '');
        // wordList.sort();
        const wordList = Object.keys(wordListWithFreqs);
        filterWords(wordList);
      } catch (e) {
        setError('Failed to fetch the word list: ' + e.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadWords();
  }, [greys, yellows, greens]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const calculatedColumns = Math.floor(width / 100); // Assuming each column needs about 100px
      setColumns(Math.max(MIN_COLUMNS, Math.min(MAX_COLUMNS, calculatedColumns))); // Clamp between min and max number of columns
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const filtered = words.filter(word => 
      searchTerm.split('').every(letter => word.includes(letter))
    );
    setFilteredWords(filtered);
  }, [searchTerm, words]);


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <input
        type="text"
        placeholder="Search for words containing..."
        value={searchTerm}
        onChange={(event) => {setSearchTerm(event.target.value.toLowerCase())}}
        className="search-input"
      />
      <p>Total possible words (sorted by frequency in English): {filteredWords.length}</p>
      <div className="word-columns">
        {Array.from({ length: Math.min(columns, filteredWords.length) }, (_, col) => (
          <div key={col} className="word-column">
            {filteredWords.slice(0, MAX_ROWS * columns)
              .filter((_, index) => index % Math.min(columns, filteredWords.length) === col) // Distribute words across columns
              .map((word, index) => (
                <button
                  className="word-button"
                  key={index}
                  onClick={() => onWordSelect(word)}
                >
                  {word}
                </button>
              ))}
          </div>
        ))}
      </div>
      {filteredWords.length > (columns * MAX_ROWS) && <p>... and {filteredWords.length - columns * MAX_ROWS} more words</p>}
    </div>
  );
};

export default WordleListFetcher;
