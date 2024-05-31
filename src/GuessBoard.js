
import { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';

import { UIColours, AnimationTimings, GameState, NUMBER_OF_LETTERS_IN_WORD} from './consts.js';


export function GuessSquare({ key, value, animationDelay, colours }) { 
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
  
export function GuessBoard({guesses, wordToGuess, currentGuessIndex, gameState, afterLettersRevealCallback}) {
    const [revealTimerFinished, setRevealTimerFinished] = useState(false);
  
    useEffect(() => {
      if (revealTimerFinished) {
        setRevealTimerFinished(false);
        afterLettersRevealCallback();
      }
    }, [revealTimerFinished, afterLettersRevealCallback]);
    
    useEffect(() => {
      if (gameState === GameState.REVEALING) {
        const timer = setTimeout(() => {
          setRevealTimerFinished(true);
        }, AnimationTimings.TOTAL_REVEAL_DURATION);
    
        return () => clearTimeout(timer);
      }
    }, [gameState]);
  
    function getUIColoursForSquare(value, wordToGuess, currentGuessIndex, rowIndex, colIndex, gameState) {    
      if (rowIndex === currentGuessIndex)
      {
        if (gameState !== GameState.REVEALING && gameState !== GameState.WON)
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
      if (rowIndex === currentGuessIndex && gameState === GameState.REVEALING)
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
  