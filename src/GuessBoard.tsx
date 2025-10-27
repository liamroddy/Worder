import { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';

import { UIColours, AnimationTimings, GameState, NUMBER_OF_LETTERS_IN_WORD, type Guesses } from './consts';

interface UIColour {
  text: string;
  background: string;
}

interface GuessSquareProps {
  value: string | null;
  animationDuration: number;
  animationDelay: number;
  loopAnimation: boolean;
  colours: UIColour;
}

export function GuessSquare({ value, animationDuration, animationDelay, loopAnimation, colours }: GuessSquareProps) {  
  const styleProps = useSpring({
    from: animationDuration > 0 ? { color: UIColours.DEFAULT.text, backgroundColor: UIColours.DEFAULT.background } : { color: colours.text, backgroundColor: colours.background },
    to: { color: colours.text, backgroundColor: colours.background },
    delay: animationDelay,
    config: { duration: animationDuration },
    loop: loopAnimation ? { reverse: true } : false
  }); 
  
  return (
    <animated.div className="guess-square" style={styleProps}>
      {value}
    </animated.div>
  );
}

interface GuessBoardProps {
  guesses: Guesses;
  wordToGuess: string;
  currentGuessIndex: number;
  gameState: GameState;
  afterLettersRevealCallback: () => void;
}

export function GuessBoard({ guesses, wordToGuess, currentGuessIndex, gameState, afterLettersRevealCallback }: GuessBoardProps) {
  const [revealTimerFinished, setRevealTimerFinished] = useState<boolean>(false);

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

  function getUIColoursForSquare(value: string | null, wordToGuess: string, currentGuessIndex: number, rowIndex: number, colIndex: number, gameState: GameState): UIColour {    
    if (rowIndex === currentGuessIndex) {
      if (gameState !== GameState.REVEALING && gameState !== GameState.WON) {
        return UIColours.GUESSING;
      }
    }
  
    if (value && wordToGuess.includes(value)) {
      if (value === wordToGuess[colIndex]) {
        return UIColours.CORRECT_GUESS;
      }
      return UIColours.ALMOST_CORRECT_GUESS;
    } else {
      return UIColours.INCORRECT_GUESS_SQUARE;
    }
  }

  function getAnimationDelay(rowIndex: number, colIndex: number, currentGuessIndex: number, gameState: GameState): number {
    if (rowIndex === currentGuessIndex) {
      if (gameState === GameState.REVEALING) {
        return colIndex * AnimationTimings.REVEAL_DELAY;
      } else if (gameState === GameState.GUESSING) {
        return (colIndex * AnimationTimings.GUESSING_PULSE_DELAY);
      }
    }
    return 0;
  }

  function getAnimationDuration(rowIndex: number, currentGuessIndex: number, gameState: GameState): number {
    if (rowIndex === currentGuessIndex) {
      if (gameState === GameState.REVEALING) {
        return AnimationTimings.REVEAL_DURATION;
      } else if (gameState === GameState.GUESSING) {
        return AnimationTimings.GUESSING_PULSE_DURATION;
      }
    }
    return 0;
  }

  return (
    <div className='guess-board'>
      {guesses.map((row, rowIndex) => (
        <div key={rowIndex} className='guess-board-row'>
          {row.map((value, colIndex) => (
            <GuessSquare
              key={(rowIndex * NUMBER_OF_LETTERS_IN_WORD) + colIndex}
              value={value}
              animationDuration={getAnimationDuration(rowIndex, currentGuessIndex, gameState)}
              animationDelay={getAnimationDelay(rowIndex, colIndex, currentGuessIndex, gameState)}
              loopAnimation={gameState === GameState.GUESSING}
              colours={getUIColoursForSquare(value, wordToGuess, currentGuessIndex, rowIndex, colIndex, gameState)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
