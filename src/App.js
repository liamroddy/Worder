import { useState, useEffect, useRef } from 'react';
import JSConfetti from 'js-confetti'

import { Keyboard } from './Keyboard.js';
import { GuessBoard } from './GuessBoard.js';

import { GameState, GameStatusText, NUMBER_OF_GUESSES_ALLOWED, NUMBER_OF_LETTERS_IN_WORD} from './consts.js';
import { dictionary } from './dictionary';

import './App.css';

export default function Game() {
  const firstKeyRef = useRef();

  const [wordToGuess, setWordToGuess] = useState(dictionary[0]);

  const [guesses, setGuesses] = useState(new Array(NUMBER_OF_GUESSES_ALLOWED).fill(null).map(() => new Array(NUMBER_OF_LETTERS_IN_WORD).fill(null)));
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0);

  const [gameState, setGameState] = useState(GameState.GUESSING);
  const [gameStatusText, setGameStatusText] = useState(GameStatusText.GUESSING);

  const setCustomGameStatusText = (status, wordToGuess = null) => {
    if (typeof status === 'function') {
      setGameStatusText(status(wordToGuess));
    }
    else
    {
      setGameStatusText(status)
    };
  };

  const jsConfetti = new JSConfetti()

  function newGame() {
    const word = dictionary[Math.floor(Math.random() * dictionary.length)];
    setWordToGuess(word);
    console.log("Hey, are you trying to cheat?! If you (hypothetically) were the word to guess would be " + word);
    
    setGuesses(new Array(NUMBER_OF_GUESSES_ALLOWED).fill(null).map(() => new Array(NUMBER_OF_LETTERS_IN_WORD).fill(null)));
    setCurrentGuessIndex(0);
    setGameState(GameState.GUESSING);
    setCustomGameStatusText(GameStatusText.GUESSING);

    firstKeyRef.current.focus();
  }

  function onLose() {
    if (gameState === GameState.GUESSING)
    {
      setGameState(GameState.LOST);
      jsConfetti.addConfetti({
        emojis: ['😭', '💔'],
        confettiNumber: 10
      });
      setCustomGameStatusText(GameStatusText.LOST, wordToGuess);
    }
  }

  useEffect(() => {
    newGame(); // run on page load
  }, []);

  function isGuessLongEnough() {
    let currentGuess = getCurrentGuess();
    return (currentGuess.filter(value => value !== null).length === NUMBER_OF_LETTERS_IN_WORD);
  }

  function getCurrentGuess() {
    return guesses[currentGuessIndex];
  }

  function onLetterEntered(value) {
    if (gameState !== GameState.GUESSING)
    {
      return;
    }

    if (!isGuessLongEnough())
    {
      let newGuesses = guesses.slice();
      let firstNullIndex = newGuesses[currentGuessIndex].findIndex(item => item === null);
      if (firstNullIndex !== -1)
      {
        newGuesses[currentGuessIndex][firstNullIndex] = value;
        setGuesses(newGuesses);
      }
    }
  }
  
  function onBackspace() {    
    if (gameState !== GameState.GUESSING)
    {
      return;
    }

    let newGuesses = guesses.slice();
    
    let firstNullIndex = newGuesses[currentGuessIndex].findIndex(item => item === null);
    if (firstNullIndex === -1)
    {
      newGuesses[currentGuessIndex][NUMBER_OF_LETTERS_IN_WORD-1] = null;  
    }
    if ((firstNullIndex-1) >= 0)
    {
      newGuesses[currentGuessIndex][firstNullIndex-1] = null;  
    }

    setGuesses(newGuesses);
  }

  function afterLettersReveal() {
    if (getCurrentGuess().join('') === wordToGuess)
      {
        setGameState(GameState.WON);
        jsConfetti.addConfetti()
        setCustomGameStatusText(GameStatusText.WON);
      }
      else
      {
        if (currentGuessIndex === NUMBER_OF_GUESSES_ALLOWED - 1)
        {
          onLose();
        }
        else
        {
          setCurrentGuessIndex(currentGuessIndex + 1);
          setGameState(GameState.GUESSING);
          setCustomGameStatusText(GameStatusText.GUESSING);
        }
      } 
  }

  function revealLetters() {
    setGameState(GameState.REVEALING);
    setCustomGameStatusText(GameStatusText.REVEALING);
  }

  function onGuessEntered() {
    if (gameState !== GameState.GUESSING)
    {
      return;
    }

    if (isGuessLongEnough())
    {
      if (dictionary.includes(getCurrentGuess().join('')))
      {
        revealLetters();  
      }
      else
      {
        setCustomGameStatusText(GameStatusText.NOT_IN_DICTIONARY);
      }
    }
    else
    {
      setCustomGameStatusText(GameStatusText.TOO_SHORT);
    }
  }

  return (
    <div className="game">
      <div className='game-title-bar'>
        <h1>WORDER</h1>
      </div>
      <div className='game-top-bar'>
        <button className="new-game-button" onClick={newGame}>New Game</button>
        <button className="give-up-button" onClick={onLose}>Give Up</button>
      </div>
      <div className="game-status">{gameStatusText}</div>
      <div className="guess-board-wrapper-outer">
        <div className='guess-board-sizer'></div>
        <div className="guess-board-wrapper-inner">
          <GuessBoard guesses={guesses} wordToGuess={wordToGuess} currentGuessIndex={currentGuessIndex} gameState={gameState} afterLettersRevealCallback={afterLettersReveal} />
        </div>
        <div className='guess-board-sizer'></div>
      </div>
      <div className="key-board-wrapper" >
        <Keyboard onLetterEntered={onLetterEntered} onBackspace={onBackspace} onGuessEntered={onGuessEntered} wordToGuess={wordToGuess} guesses={guesses} currentGuessIndex={currentGuessIndex} gameState={gameState} firstKeyRef={firstKeyRef} />
      </div>
      <div className="game-bottom-bar">
        <footer>Warning: the dictionary for this game is sourced from<br></br><a href='https://www-cs-faculty.stanford.edu/~knuth/sgb-words.txt'>https://www-cs-faculty.stanford.edu/~knuth/sgb-words.txt</a><br></br>and may contain words that are not suitable for all audiences.<br></br>Player discretion is advised.
        </footer>
      </div>

    </div>
  );
}
