
// Filename - App.js
 
// Importing modules
import React, { useState, useEffect } from "react";
import "./App.css";
import WordleListFetcher from './WordleListFetcher.tsx';

function App() {
    // usestate for setting a javascript
    // object for storing and using data
    const [data, setdata] = useState({
        name: "",
        age: 0,
        date: "",
        programming: "",
    });

    const [words, setWords] = useState(null)
 
    // Using useEffect for single rendering
    useEffect(() => {
        // Using fetch to fetch the api from 
        // flask server it will be redirected to proxy
        fetch("/data").then((res) =>
            res.json().then((data) => {
                // Setting a data from api
                setdata({
                    name: data.Name,
                    age: data.Age,
                    date: data.Date,
                    programming: data.programming,
                });
            })
        );
    }, []);
 
 
    useEffect(() => {
        fetch('https://raw.githubusercontent.com/tabatkins/wordle-list/main/words')
          .then(response => response.json())
          .then(data => setWords(data))
          .catch(error => console.error(error));
      }, []);
 
    console.log(words)
    return (
        <div className="App">
            <header className="App-header">
                <h1>React and flask</h1>
                {/* Calling a data from setdata for showing */}
                <p>{data.name}</p>
                <p>{data.age}</p>
                <p>{data.date}</p>
                <p>{data.programming}</p>
                <WordleListFetcher />
 
            </header>
        </div>
    );
}
 
export default App;