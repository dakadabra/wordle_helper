// Code taken from https://gist.github.com/iancward/afe148f28c5767d5ced7a275c12816a3

import React, { useState, useEffect } from 'react';

const WordleListFetcher = ({yellows, greens}) => {
  const [words, setWords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  function filterWords(wordList) {
    let filteredList = wordList;
    for (let i = 0; i < 5; i++) {
      if (greens[i] !== "") {
        filteredList = filteredList.filter(word => word[i] === greens[i]);
      }
      if (yellows[i] !== "") {
        filteredList = filteredList.filter(word => word[i] !== yellows[i] &&
                                           word.includes(yellows[i]));
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
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p>Total possible words: {words.length}</p>
      <ul className="max-h-60 overflow-y-auto">
        {words.slice(0, 100).map((word, index) => (
          <li key={index}>{word}</li>
        ))}
      </ul>
      {words.length > 100 && <p>... and {words.length - 100} more words</p>}
    </div>
  );
};

export default WordleListFetcher;
