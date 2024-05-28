import { useState, useEffect, useRef, forwardRef } from 'react';
import { useSpring, animated } from 'react-spring';
import './App.css';

import JSConfetti from 'js-confetti'

import { dictionary } from './dictionary';

const NUMBER_OF_LETTERS_IN_WORD = 5;
const NUMBER_OF_GUESSES_ALLOWED = 5;

const AnimationTimings = {
  REVEAL_DURATION: 200, // ms
  REVEAL_DELAY: 300,
  TOTAL_REVEAL_DURATION: 0
}
AnimationTimings.TOTAL_REVEAL_DURATION = (NUMBER_OF_LETTERS_IN_WORD * AnimationTimings.REVEAL_DELAY) + AnimationTimings.REVEAL_DURATION;

const UIColours = {
  DEFAULT: {
    text: 'black',
    background: 'white'
  },
  GUESSING: {
    text: 'white',
    background: '#b2acfa'
  },
  CORRECT_GUESS: {
    text: 'white',
    background: 'green'
  },
  ALMOST_CORRECT_GUESS: {
    text: 'white',
    background: 'orange'
  },
  INCORRECT_GUESS_SQUARE: {
    text: 'black',
    background: 'white'
  },
  INCORRECT_GUESS_KEY: {
    text: 'black',
    background: 'grey'
  }
};

const GameStates = {
  GUESSING: 1,
  REVEALING: 2,
  WON: 3,   
  LOST: 4
};

const GameStatusText = {
  GUESSING: <span>Enter a guess!<br></br>Use a keyboard or click the letters below</span>,
  WON: 'Congrats! You won! \uD83C\uDF89',
  LOST: (wordToGuess) => <span>You lost! The word was <strong>{wordToGuess}</strong><br></br>Click <strong>'New Game'</strong> to try again</span>,
  NOT_IN_DICTIONARY: 'Word not in dictionary!',
  TOO_SHORT: 'Guess too short!',
  REVEALING: 'Hmmm......'
};

function GuessSquare({ key, value, animationDelay, colours }) { 
  let animationDuration = (animationDelay >= 0) ? AnimationTimings.REVEAL_DURATION : 0;

  const styleProps = useSpring({
    from: { color: UIColours.DEFAULT.text, backgroundColor: UIColours.DEFAULT.background},
    to: { color: colours.text, backgroundColor: colours.background},
    delay: animationDelay,
    config: { duration: animationDuration },
  }); 
  
  return (
    <animated.div className="guess-square" style={styleProps}>
      {value}
    </animated.div>
  );
}

function GuessBoard({guesses, wordToGuess, currentGuessIndex, gameState, afterLettersRevealCallback}) {
  const [revealTimerFinished, setRevealTimerFinished] = useState(false);

  useEffect(() => {
    if (revealTimerFinished) {
      setRevealTimerFinished(false);
      afterLettersRevealCallback();
    }
  }, [revealTimerFinished, afterLettersRevealCallback]);
  
  useEffect(() => {
    if (gameState === GameStates.REVEALING) {
      const timer = setTimeout(() => {
        setRevealTimerFinished(true);
      }, AnimationTimings.TOTAL_REVEAL_DURATION);
  
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  function getUIColoursForSquare(value, wordToGuess, currentGuessIndex, rowIndex, colIndex, gameState) {    
    if (rowIndex === currentGuessIndex)
    {
      if (gameState !== GameStates.REVEALING && gameState !== GameStates.WON)
      {
        return UIColours.GUESSING;
      }
    }
  
    if (wordToGuess.includes(value))
    {
      if (value === wordToGuess[colIndex])
      {
        return UIColours.CORRECT_GUESS;
      }
      return UIColours.ALMOST_CORRECT_GUESS;
    }
    else
    {
      return UIColours.INCORRECT_GUESS_SQUARE;
    }
  }

  function getAnimationDelay(rowIndex, colIndex, currentGuessIndex, gameState) {
    if (rowIndex === currentGuessIndex && gameState === GameStates.REVEALING)
    {
      return colIndex * AnimationTimings.REVEAL_DELAY;
    }
    return -1;
  }

  return (
    <div className='guess-board'>
      {guesses.map((row, rowIndex) => (
        <div key={rowIndex} className='guess-board-row'>
          {row.map((value, colIndex) => (
            <GuessSquare
              key={(rowIndex * NUMBER_OF_LETTERS_IN_WORD) + colIndex}
              value={value}
              animationDelay={getAnimationDelay(rowIndex, colIndex, currentGuessIndex, gameState)}
              colours={getUIColoursForSquare(value, wordToGuess, currentGuessIndex, rowIndex, colIndex, gameState)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

const KeySquare = forwardRef(({value, onSquareClick, colours=[UIColours.DEFAULT, UIColours.DEFAULT], animationDelay}, ref=null) => {
  const animationDuration = (animationDelay > 0) ? AnimationTimings.REVEAL_DURATION : 0;
  
  let fromColours = colours[0];
  let toColours = colours[1];

  const styleProps = useSpring({
    from: { color: fromColours.text, backgroundColor: fromColours.background},
    to: { color: toColours.text, backgroundColor: toColours.background},
    delay: animationDelay, 
    config: { duration: animationDuration },
  }); 
  
  return (
    <animated.button className="key-square" onClick={() => onSquareClick(value)} style={styleProps} ref={ref} tabIndex="0">
      {value}     
    </animated.button>
  );
});

function KeyBoard( {onLetterEntered, onBackspace, onGuessEntered, wordToGuess, guesses, currentGuessIndex, gameState, firstKeyRef} ) { 
  const animationDelay = (gameState === GameStates.GUESSING && currentGuessIndex === 0) ? 0 : (AnimationTimings.REVEAL_DELAY * NUMBER_OF_LETTERS_IN_WORD); // this ensures keyboard styling clears instantly on new game

  useEffect(() => {
    const handleKeyUp = (event) => {
      const key = event.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        onLetterEntered(key);
      } else if (key === 'BACKSPACE' || key === 'DELETE') {
        onBackspace();
      } else if (key === 'ENTER') {
        onGuessEntered();
      }
    };

    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onLetterEntered, onBackspace, onGuessEntered]);

  function getUIColoursForKey(value, wordToGuess, guesses, currentGuessIndex, gameState) {
    let toColours = null;
    let fromColours = UIColours.DEFAULT;

    let currentGuess = guesses[currentGuessIndex];
    let previousGuesses = guesses.slice(0, currentGuessIndex);

    // get toColours
    if (gameState === GameStates.REVEALING || gameState === GameStates.WON)
    {
      if (currentGuess.includes(value))
      {
        if (wordToGuess.includes(value))
        {
          if (wordToGuess.indexOf(value) === currentGuess.findIndex(guess => guess.includes(value)))
          {
            toColours = UIColours.CORRECT_GUESS;
          }
          else
          {
            toColours = UIColours.ALMOST_CORRECT_GUESS;
          }
        }
        else
        {
          toColours = UIColours.INCORRECT_GUESS_KEY;
        }
      }
    }

    // get fromColours
    if (previousGuesses.some(guess => guess.includes(value)))
    {
      if (wordToGuess.includes(value))
      {
        fromColours = UIColours.ALMOST_CORRECT_GUESS;
        for (const element of previousGuesses)
        {
          if (element.includes(value))
          {
            if (wordToGuess.indexOf(value) === element.findIndex(guess => guess.includes(value)))
            {
              fromColours = UIColours.CORRECT_GUESS;
              break;
            }
          }
        }
      }
      else
      {
        fromColours = UIColours.INCORRECT_GUESS_KEY;
      }
    }

    if (toColours === null)
    {
      toColours = fromColours;
    }

    return [fromColours, toColours]; 
  }
  
  return (
    <div className="key-board">
      <div className="key-board-row">
        <KeySquare value="Q" onSquareClick={onLetterEntered} colours={getUIColoursForKey("Q", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
        <KeySquare value="W" onSquareClick={onLetterEntered} colours={getUIColoursForKey("W", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
        <KeySquare value="E" onSquareClick={onLetterEntered} colours={getUIColoursForKey("E", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
        <KeySquare value="R" onSquareClick={onLetterEntered} colours={getUIColoursForKey("R", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
        <KeySquare value="T" onSquareClick={onLetterEntered} colours={getUIColoursForKey("T", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
        <KeySquare value="Y" onSquareClick={onLetterEntered} colours={getUIColoursForKey("Y", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
        <KeySquare value="U" onSquareClick={onLetterEntered} colours={getUIColoursForKey("U", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
        <KeySquare value="I" onSquareClick={onLetterEntered} colours={getUIColoursForKey("I", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
        <KeySquare value="O" onSquareClick={onLetterEntered} colours={getUIColoursForKey("O", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
        <KeySquare value="P" onSquareClick={onLetterEntered} colours={getUIColoursForKey("P", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
      </div>
      <div className="key-board-row">
        <KeySquare value="A" onSquareClick={onLetterEntered} colours={getUIColoursForKey("A", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
        <KeySquare value="S" onSquareClick={onLetterEntered} colours={getUIColoursForKey("S", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
        <KeySquare value="D" onSquareClick={onLetterEntered} colours={getUIColoursForKey("D", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
        <KeySquare value="F" onSquareClick={onLetterEntered} colours={getUIColoursForKey("F", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
        <KeySquare value="G" onSquareClick={onLetterEntered} colours={getUIColoursForKey("G", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
        <KeySquare value="H" onSquareClick={onLetterEntered} colours={getUIColoursForKey("H", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
        <KeySquare value="J" onSquareClick={onLetterEntered} colours={getUIColoursForKey("J", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
        <KeySquare value="K" onSquareClick={onLetterEntered} colours={getUIColoursForKey("K", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
        <KeySquare value="L" onSquareClick={onLetterEntered} colours={getUIColoursForKey("L", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
      </div>
      <div className="key-board-row">
        <KeySquare value="ENTER" onSquareClick={onGuessEntered} ref={firstKeyRef}/>
        <KeySquare value="Z" onSquareClick={onLetterEntered} colours={getUIColoursForKey("Z", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
        <KeySquare value="X" onSquareClick={onLetterEntered} colours={getUIColoursForKey("X", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
        <KeySquare value="C" onSquareClick={onLetterEntered} colours={getUIColoursForKey("C", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
        <KeySquare value="V" onSquareClick={onLetterEntered} colours={getUIColoursForKey("V", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
        <KeySquare value="B" onSquareClick={onLetterEntered} colours={getUIColoursForKey("B", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
        <KeySquare value="N" onSquareClick={onLetterEntered} colours={getUIColoursForKey("N", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
        <KeySquare value="M" onSquareClick={onLetterEntered} colours={getUIColoursForKey("M", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
        <KeySquare value="&larr;" onSquareClick={onBackspace} />      
      </div>
    </div>
  );
}

export default function Game() {
  const firstKeyRef = useRef();

  const [wordToGuess, setWordToGuess] = useState(dictionary[0]);

  const [guesses, setGuesses] = useState(new Array(NUMBER_OF_GUESSES_ALLOWED).fill(null).map(() => new Array(NUMBER_OF_LETTERS_IN_WORD).fill(null)));
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0);

  const [gameState, setGameState] = useState(GameStates.GUESSING);
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
    setGameState(GameStates.GUESSING);
    setCustomGameStatusText(GameStatusText.GUESSING);

    firstKeyRef.current.focus();
  }

  function onLose() {
    if (gameState === GameStates.GUESSING)
    {
      setGameState(GameStates.LOST);
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
    if (gameState !== GameStates.GUESSING)
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
    if (gameState !== GameStates.GUESSING)
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
        setGameState(GameStates.WON);
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
          setGameState(GameStates.GUESSING);
          setCustomGameStatusText(GameStatusText.GUESSING);
        }
      } 
  }

  function revealLetters() {
    setGameState(GameStates.REVEALING);
    setCustomGameStatusText(GameStatusText.REVEALING);
  }

  function onGuessEntered() {
    if (gameState !== GameStates.GUESSING)
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
        <KeyBoard onLetterEntered={onLetterEntered} onBackspace={onBackspace} onGuessEntered={onGuessEntered} wordToGuess={wordToGuess} guesses={guesses} currentGuessIndex={currentGuessIndex} gameState={gameState} firstKeyRef={firstKeyRef} />
      </div>
      <div className="game-bottom-bar">
        <footer>Warning: the dictionary for this game is sourced from<br></br><a href='https://www-cs-faculty.stanford.edu/~knuth/sgb-words.txt'>https://www-cs-faculty.stanford.edu/~knuth/sgb-words.txt</a><br></br>and may contain words that are not suitable for all audiences.<br></br>Player discretion is advised.
        </footer>
      </div>

    </div>
  );
}
