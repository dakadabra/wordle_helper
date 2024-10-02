// Code inspired by https://gist.github.com/iancward/afe148f28c5767d5ced7a275c12816a3

import React, { useState, useEffect, useCallback } from 'react';
import './WordleListFetcher.css';
import wordListWithFreqs from './word_freq_data/filtered_words.json';

const MAX_COLUMNS = 10;
const MIN_COLUMNS = 1;

interface WordleListFetcherProps {
  greys: string[][];
  yellows: string[][];
  greens: string[];
  onWordSelect: (word: string) => void;
}

const WordleListFetcher: React.FC<WordleListFetcherProps> = ({ greys, yellows, greens, onWordSelect }) => {
  const [words, setWords] = useState<string[]>([]);
  const [filteredWords, setFilteredWords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [columns, setColumns] = useState<number>(MAX_COLUMNS);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [letterFrequency, setLetterFrequency] = useState<[string, number][]>([]);

  const filterWords = useCallback((wordList: string[]) => {
    let filteredList = wordList;
    for (let currLetterIdx = 0; currLetterIdx < 5; currLetterIdx++) { // for each letter in the word
      if (greens[currLetterIdx] !== "") {
        filteredList = filteredList.filter(word => word[currLetterIdx] === greens[currLetterIdx]);
      }
      if (yellows[currLetterIdx].length > 0) {
        filteredList = filteredList.filter(word => {
          return yellows[currLetterIdx].every(yellowLetter => {
            const yellowCount = yellows.flat().filter(l => l === yellowLetter).length;
            const greenCount = greens.filter(l => l === yellowLetter).length;
            const wordCount = word.split('').filter(l => l === yellowLetter).length;
            return word[currLetterIdx] !== yellowLetter && wordCount >= yellowCount + greenCount;
          });
        });
      }
      if (greys[currLetterIdx].length > 0) {
        filteredList = filteredList.filter(word => {
          return greys[currLetterIdx].every(greyLetter => 
            (word[currLetterIdx] !== greyLetter) &&
            (!word.includes(greyLetter) ||
            greens.includes(greyLetter) ||
            yellows.some(col => col.includes(greyLetter)))
          );
        });
      }
    }
    return filteredList;
  }, [greens, yellows, greys]);

  useEffect(() => {
    const loadWords = async () => {
      try {
        const wordList = Object.keys(wordListWithFreqs);
        const filteredList = filterWords(wordList);
        setWords(filteredList);
        setFilteredWords(filteredList);
      } catch (e) {
        setError('Failed to fetch the word list: ' + e.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadWords();
  }, [filterWords]);

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

  useEffect(() => {
    const frequency: { [key: string]: number } = {};
    filteredWords.forEach(word => {
      const uniqueLetters = new Set(word.split('')); // So that we don't double count letters that appear twice in the same word
      uniqueLetters.forEach(letter => {
        frequency[letter] = (frequency[letter] || 0) + 1;
      });
    });
    const sortedFrequency = Object.entries(frequency)
      .map(([letter, count]) => [
        letter,
        Number(Math.min(100, ((count / filteredWords.length) * 100)).toFixed(2))
      ] as [string, number])
      .sort((a, b) => b[1] - a[1]);

    setLetterFrequency(sortedFrequency);
  }, [filteredWords]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="letter-search-component">
        <LetterFrequency letterFrequency={letterFrequency} setSearchTerm={setSearchTerm} />
        <input
          type="text"
          placeholder="Search for words containing..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value.toLowerCase())}
          className="search-input"
        />
      </div>
      <WordList 
        filteredWords={filteredWords}
        columns={columns}
        onWordSelect={onWordSelect}
      />
    </>
  );
};

const LetterFrequency = ({letterFrequency, setSearchTerm }) => {
  return (
    <div className="letter-frequency">
      {letterFrequency.map(([letter, count]) => (
        <button key={letter} className="letter-square" onClick={() => setSearchTerm(prev => prev + letter)}>
          {`${letter.toUpperCase()} ${count}%`}
        </button>
      ))}
    </div>
  );
};

const WordList = ({ filteredWords, columns, onWordSelect }) => {
  const MAX_ROWS = 20;

  return (
    <>
      <h4>Total possible words (sorted by frequency in English): {filteredWords.length}</h4>
      <div className="word-columns">
        {Array.from({ length: Math.min(columns, filteredWords.length) }, (_, col) => (
          <div key={col} className="word-column">
            {filteredWords.slice(0, MAX_ROWS * columns)
              .filter((_: any, index: number) => index % Math.min(columns, filteredWords.length) === col) // Distribute words across columns
              .map((word: string, index: number) => (
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
    </>
  );
};

export default WordleListFetcher;
