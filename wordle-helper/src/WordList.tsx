
import React, { useState, useEffect } from 'react';
import './WordList.css';

interface WordListProps {
    filteredWords: string[];
    onWordSelect: (word: string) => void;
}
  
const WordList: React.FC<WordListProps> = ({ filteredWords, onWordSelect }) => {
    const MAX_ROWS = 20;
    const MAX_COLUMNS = 10;
    const MIN_COLUMNS = 1;
    const [columns, setColumns] = useState<number>(MAX_COLUMNS);
  
    useEffect(() => {
      const handleResize = (): void => {
        const width = window.innerWidth;
        const calculatedColumns = Math.floor(width / 100); // Assuming each column needs about 100px
        setColumns(Math.max(MIN_COLUMNS, Math.min(MAX_COLUMNS, calculatedColumns))); // Clamp between min and max number of columns
      };
  
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    return (
      <>
        <h4>Total possible words (sorted by frequency in English): {filteredWords.length}</h4>
        <div className="word-columns">
          {Array.from({ length: Math.min(columns, filteredWords.length) }, (_, col) => (
            <div key={col} className="word-column">
              {filteredWords.slice(0, MAX_ROWS * columns)
                .filter((_, index: number) => index % Math.min(columns, filteredWords.length) === col) // Distribute words across columns
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
  
export default WordList;