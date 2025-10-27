import { useEffect, forwardRef } from 'react';
import { useSpring, animated } from 'react-spring';

import { UIColours, AnimationTimings, GameState, NUMBER_OF_LETTERS_IN_WORD, type Guesses } from './consts';

interface UIColour {
  text: string;
  background: string;
}

interface KeyboardKeyProps {
  value: string;
  onSquareClick: (value: string) => void;
  colours?: [UIColour, UIColour];
  animationDelay?: number;
}

const KeyboardKey = forwardRef<HTMLButtonElement, KeyboardKeyProps>(({ value, onSquareClick, colours = [UIColours.DEFAULT, UIColours.DEFAULT], animationDelay = 0 }, ref = null) => {
  const animationDuration = (animationDelay > 0) ? AnimationTimings.REVEAL_DURATION : 0;
  
  const fromColours = colours[0];
  const toColours = colours[1];

  const styleProps = useSpring({
    from: { color: fromColours.text, backgroundColor: fromColours.background },
    to: { color: toColours.text, backgroundColor: toColours.background },
    delay: animationDelay, 
    config: { duration: animationDuration },
  }); 
  
  return (
    <animated.button
      ref={ref}
      className="key-square"
      id={value === 'ENTER' ? 'enter-key-square' : ''}
      onClick={() => onSquareClick(value)}
      style={styleProps}
      tabIndex={0}
    >
      {value}     
    </animated.button>
  );
});

KeyboardKey.displayName = 'KeyboardKey';

interface KeyboardProps {
  onLetterEntered: (letter: string) => void;
  onBackspace: () => void;
  onGuessEntered: () => void;
  wordToGuess: string;
  guesses: Guesses;
  currentGuessIndex: number;
  gameState: GameState;
  blockKeyboardInput: boolean;
}

export function Keyboard({ onLetterEntered, onBackspace, onGuessEntered, wordToGuess, guesses, currentGuessIndex, gameState, blockKeyboardInput }: KeyboardProps) { 
  const animationDelay = (gameState === GameState.GUESSING && currentGuessIndex === 0) ? 0 : (AnimationTimings.REVEAL_DELAY * NUMBER_OF_LETTERS_IN_WORD); // this ensures keyboard styling clears instantly on new game

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (!blockKeyboardInput) {
        const key = event.key.toUpperCase();
        if (/^[A-Z]$/.test(key)) {
          onLetterEntered(key);
        } else if (key === 'BACKSPACE' || key === 'DELETE') {
          onBackspace();
        } else if (key === 'ENTER') {
          onGuessEntered();
        }
      }
    };

    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onLetterEntered, onBackspace, onGuessEntered, blockKeyboardInput]);

  function getUIColoursForKey(value: string, wordToGuess: string, guesses: Guesses, currentGuessIndex: number, gameState: GameState): [UIColour, UIColour] {
    let toColours: UIColour | null = null;
    let fromColours: UIColour = UIColours.DEFAULT;

    const currentGuess = guesses[currentGuessIndex];
    const previousGuesses = guesses.slice(0, currentGuessIndex);

    // get toColours
    if (gameState === GameState.REVEALING || gameState === GameState.WON) {
      if (currentGuess.includes(value)) {
        if (wordToGuess.includes(value)) {
          toColours = UIColours.ALMOST_CORRECT_GUESS;
          
          for (let i = 0; i < currentGuess.length; i++) {
            if (currentGuess[i] === value && currentGuess[i] === wordToGuess[i]) {
              toColours = UIColours.CORRECT_GUESS;
              break;
            }
          }
        } else {
          toColours = UIColours.INCORRECT_GUESS_KEY;
        }
      }
    }

    // get fromColours
    if (previousGuesses.some(guess => guess.includes(value))) {
      if (wordToGuess.includes(value)) {
        fromColours = UIColours.ALMOST_CORRECT_GUESS;
        for (const previousGuess of previousGuesses) {
          if (previousGuess.includes(value)) {
            for (let i = 0; i < currentGuess.length; i++) {
              if (previousGuess[i] === value && previousGuess[i] === wordToGuess[i]) {
                fromColours = UIColours.CORRECT_GUESS;
                break;
              }
            }
          }
        }
      } else {
        fromColours = UIColours.INCORRECT_GUESS_KEY;
      }
    }

    if (toColours === null) {
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
        <KeyboardKey value="ENTER" onSquareClick={onGuessEntered}/>
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
