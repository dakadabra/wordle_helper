import React, { useState, useEffect } from 'react';

const WordleListFetcher = () => {
  const [words, setWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/tabatkins/wordle-list/main/words');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const wordList = text.split('\n').filter(word => word.trim() !== '');
        setWords(wordList);
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
      <h2>Wordle Word List</h2>
      <p>Total words: {words.length}</p>
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
