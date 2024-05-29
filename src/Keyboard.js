import { useEffect, forwardRef } from 'react';
import { useSpring, animated } from 'react-spring';

import { UIColours, AnimationTimings, GameState, NUMBER_OF_LETTERS_IN_WORD} from './consts.js';

const KeyboardKey = forwardRef(({value, onSquareClick, colours=[UIColours.DEFAULT, UIColours.DEFAULT], animationDelay}, ref=null) => {
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
  
export function Keyboard( {onLetterEntered, onBackspace, onGuessEntered, wordToGuess, guesses, currentGuessIndex, gameState, firstKeyRef} ) { 
    const animationDelay = (gameState === GameState.GUESSING && currentGuessIndex === 0) ? 0 : (AnimationTimings.REVEAL_DELAY * NUMBER_OF_LETTERS_IN_WORD); // this ensures keyboard styling clears instantly on new game
  
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
  
    // TODO - this is not 100% correct 
    // set wordToGuess to CASAS
    // guess FREAK
    // A on GuessSquare turns GREEN
    // A on Keyboard turns ORANGE
    function getUIColoursForKey(value, wordToGuess, guesses, currentGuessIndex, gameState) {
      let toColours = null;
      let fromColours = UIColours.DEFAULT;
  
      let currentGuess = guesses[currentGuessIndex];
      let previousGuesses = guesses.slice(0, currentGuessIndex);
  
      // get toColours
      if (gameState === GameState.REVEALING || gameState === GameState.WON)
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
          <KeyboardKey value="Q" onSquareClick={onLetterEntered} colours={getUIColoursForKey("Q", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
          <KeyboardKey value="W" onSquareClick={onLetterEntered} colours={getUIColoursForKey("W", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
          <KeyboardKey value="E" onSquareClick={onLetterEntered} colours={getUIColoursForKey("E", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
          <KeyboardKey value="R" onSquareClick={onLetterEntered} colours={getUIColoursForKey("R", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
          <KeyboardKey value="T" onSquareClick={onLetterEntered} colours={getUIColoursForKey("T", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
          <KeyboardKey value="Y" onSquareClick={onLetterEntered} colours={getUIColoursForKey("Y", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
          <KeyboardKey value="U" onSquareClick={onLetterEntered} colours={getUIColoursForKey("U", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
          <KeyboardKey value="I" onSquareClick={onLetterEntered} colours={getUIColoursForKey("I", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
          <KeyboardKey value="O" onSquareClick={onLetterEntered} colours={getUIColoursForKey("O", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
          <KeyboardKey value="P" onSquareClick={onLetterEntered} colours={getUIColoursForKey("P", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
        </div>
        <div className="key-board-row">
          <KeyboardKey value="A" onSquareClick={onLetterEntered} colours={getUIColoursForKey("A", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
          <KeyboardKey value="S" onSquareClick={onLetterEntered} colours={getUIColoursForKey("S", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
          <KeyboardKey value="D" onSquareClick={onLetterEntered} colours={getUIColoursForKey("D", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
          <KeyboardKey value="F" onSquareClick={onLetterEntered} colours={getUIColoursForKey("F", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
          <KeyboardKey value="G" onSquareClick={onLetterEntered} colours={getUIColoursForKey("G", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
          <KeyboardKey value="H" onSquareClick={onLetterEntered} colours={getUIColoursForKey("H", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
          <KeyboardKey value="J" onSquareClick={onLetterEntered} colours={getUIColoursForKey("J", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
          <KeyboardKey value="K" onSquareClick={onLetterEntered} colours={getUIColoursForKey("K", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
          <KeyboardKey value="L" onSquareClick={onLetterEntered} colours={getUIColoursForKey("L", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
        </div>
        <div className="key-board-row">
          <KeyboardKey value="ENTER" onSquareClick={onGuessEntered} ref={firstKeyRef}/>
          <KeyboardKey value="Z" onSquareClick={onLetterEntered} colours={getUIColoursForKey("Z", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
          <KeyboardKey value="X" onSquareClick={onLetterEntered} colours={getUIColoursForKey("X", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
          <KeyboardKey value="C" onSquareClick={onLetterEntered} colours={getUIColoursForKey("C", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
          <KeyboardKey value="V" onSquareClick={onLetterEntered} colours={getUIColoursForKey("V", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
          <KeyboardKey value="B" onSquareClick={onLetterEntered} colours={getUIColoursForKey("B", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
          <KeyboardKey value="N" onSquareClick={onLetterEntered} colours={getUIColoursForKey("N", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
          <KeyboardKey value="M" onSquareClick={onLetterEntered} colours={getUIColoursForKey("M", wordToGuess, guesses, currentGuessIndex, gameState)} animationDelay={animationDelay} />
          <KeyboardKey value="&larr;" onSquareClick={onBackspace} />      
        </div>
      </div>
    );
  }