// Code inspired by https://gist.github.com/iancward/afe148f28c5767d5ced7a275c12816a3

import React, { useState, useEffect } from 'react';
import './LetterFrequency.css';

interface WordFrequency {
  [key: string]: number;
}

interface LetterFrequencyProps {
  words: string[];
  searchedLetters: string;
  setSearchedLetters: React.Dispatch<React.SetStateAction<string>>;
}

const LetterFrequency: React.FC<LetterFrequencyProps> = ({words, searchedLetters, setSearchedLetters }) => {
  const [letterFrequency, setLetterFrequency] = useState<[string, number][]>([]);

  useEffect(() => {
    const frequency: WordFrequency = {};
    words.forEach((word: string) => {
      const uniqueLetters = new Set(word.split('')); // So that we don't double count letters that appear twice in the same word
      uniqueLetters.forEach((letter: string) => {
        frequency[letter] = (frequency[letter] || 0) + 1;
      });
    });
    const sortedFrequency = Object.entries(frequency)
      .map(([letter, count]) => [
        letter,
        Number(Math.min(100, ((count / words.length) * 100)).toFixed(2))
      ] as [string, number])
      .sort((a, b) => b[1] - a[1]);

    setLetterFrequency(sortedFrequency);
  }, [words]);

  const handleLetterClick = (letter: string): void => {
    setSearchedLetters((prev: string) => prev + letter);
  };

  return (
    <div className="letter-search-component">
      <input
        type="text"
        placeholder="Search for words containing..."
        value={searchedLetters}
        onChange={(event) => setSearchedLetters(event.target.value.toLowerCase())}
        className="search-input"
      />
      <div className="letter-frequency">
        {letterFrequency.map(([letter, count]) => (
          <button key={letter} className="letter-square" onClick={() => handleLetterClick(letter)}>
            {`${letter.toUpperCase()} ${count}%`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LetterFrequency;