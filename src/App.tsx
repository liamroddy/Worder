import { useState, useEffect } from 'react';

import { Keyboard } from './Keyboard';
import { GuessBoard } from './GuessBoard';
import { GiveUpModalButton, HowToPlayModalButton, StatsModalButton, GameOverModal, WinModal } from './modals';

import { GameState, GameStatusText, NUMBER_OF_GUESSES_ALLOWED, NUMBER_OF_LETTERS_IN_WORD, type Guesses } from './consts';
import { dictionary } from './dictionary';

import './App.scss';

export default function Game() {
  const [wordToGuess, setWordToGuess] = useState<string>(dictionary[0]);

  const [guesses, setGuesses] = useState<Guesses>(
    new Array(NUMBER_OF_GUESSES_ALLOWED).fill(null).map(() => new Array(NUMBER_OF_LETTERS_IN_WORD).fill(null))
  );
  const [currentGuessIndex, setCurrentGuessIndex] = useState<number>(0);

  const [gameState, setGameState] = useState<GameState>(GameState.GUESSING);
  const [gameStatusText, setGameStatusText] = useState<React.ReactNode>(GameStatusText.GUESSING);

  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState<boolean>(false);
  const [isWinModalOpen, setIsWinModalOpen] = useState<boolean>(false);

  const [blockKeyboardInput, setBlockKeyboardInput] = useState<boolean>(false);

  const [gamesPlayed, setGamesPlayed] = useState<number>(0);
  const [wins, setWins] = useState<number[]>(Array(NUMBER_OF_GUESSES_ALLOWED).fill(0));

  // save game stats to browser storage on update
  useEffect(() => {
    const gameStatistics = { gamesPlayed, wins };
    localStorage.setItem('gameStatistics', JSON.stringify(gameStatistics));
  }, [gamesPlayed, wins]);

  function onLose() {
    setGameState(GameState.LOST);
    setIsGameOverModalOpen(true);
    setGameStatusText(GameStatusText.BLANK);

    setGamesPlayed(prevGamesPlayed => prevGamesPlayed + 1);
  }

  function onWin() {
    setGameState(GameState.WON);
    setIsWinModalOpen(true);
    setGameStatusText(GameStatusText.BLANK);

    setGamesPlayed(prevGamesPlayed => prevGamesPlayed + 1);
    setWins(prevWins => {
      const newWins = [...prevWins];
      newWins[currentGuessIndex]++;
      return newWins;
    });
  }

  function newGame() {
    const word = dictionary[Math.floor(Math.random() * dictionary.length)];
    setWordToGuess(word);
    console.log("Hey, are you trying to cheat?! If you (hypothetically) were the word to guess would be " + word);
    
    setGuesses(new Array(NUMBER_OF_GUESSES_ALLOWED).fill(null).map(() => new Array(NUMBER_OF_LETTERS_IN_WORD).fill(null)));
    setCurrentGuessIndex(0);
    setGameState(GameState.GUESSING);
    setGameStatusText(GameStatusText.GUESSING);

    setIsGameOverModalOpen(false);
    setIsWinModalOpen(false);

    unfocusElements();
  }

  function unfocusElements() {
    // unfocus any element that is currently focused
    // why? because if a user is using keyboard input to play the game, they may accidentally trigger the modal when they press enter to submit a guess
    if (document.activeElement && document.activeElement instanceof HTMLElement) {
      setTimeout(() => (document.activeElement as HTMLElement).blur(), 0);
    }
  }

  function openModalCallback() {
    setBlockKeyboardInput(true);
  }

  function closeModalCallback() {
    unfocusElements();
    setBlockKeyboardInput(false);
  }

  useEffect(() => {
    newGame(); // run on page load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function isGuessLongEnough(): boolean {
    const currentGuess = getCurrentGuess();
    return (currentGuess.filter(value => value !== null).length === NUMBER_OF_LETTERS_IN_WORD);
  }

  function getCurrentGuess() {
    return guesses[currentGuessIndex];
  }

  function onLetterEntered(value: string) {
    if (gameState !== GameState.GUESSING) {
      return;
    }

    if (!isGuessLongEnough()) {
      const newGuesses = guesses.slice();
      const firstNullIndex = newGuesses[currentGuessIndex].findIndex(item => item === null);
      if (firstNullIndex !== -1) {
        newGuesses[currentGuessIndex][firstNullIndex] = value;
        setGuesses(newGuesses);
      }
    }
  }
  
  function onBackspace() {    
    if (gameState !== GameState.GUESSING) {
      return;
    }

    const newGuesses = guesses.slice();
    
    const firstNullIndex = newGuesses[currentGuessIndex].findIndex(item => item === null);
    if (firstNullIndex === -1) {
      newGuesses[currentGuessIndex][NUMBER_OF_LETTERS_IN_WORD-1] = null;  
    }
    if ((firstNullIndex-1) >= 0) {
      newGuesses[currentGuessIndex][firstNullIndex-1] = null;  
    }

    setGuesses(newGuesses);
  }

  function afterLettersReveal() {
    if (getCurrentGuess().join('') === wordToGuess) {
      onWin();
    } else {
      if (currentGuessIndex === NUMBER_OF_GUESSES_ALLOWED - 1) {
        onLose();
      } else {
        setCurrentGuessIndex(currentGuessIndex + 1);
        setGameState(GameState.GUESSING);
        setGameStatusText(GameStatusText.GUESSING);
      }
    } 
  }

  function revealLetters() {
    setGameState(GameState.REVEALING);
    setGameStatusText(GameStatusText.REVEALING);
  }

  function onGuessEntered() {
    if (gameState !== GameState.GUESSING) {
      return;
    }

    if (isGuessLongEnough()) {
      if (dictionary.includes(getCurrentGuess().join(''))) {
        revealLetters();  
      } else {
        setGameStatusText(GameStatusText.NOT_IN_DICTIONARY);
      }
    } else {
      setGameStatusText(GameStatusText.TOO_SHORT);
    }
  }

  return (
    <div className="game">
      <div className='noise'></div>
      <div className='game-title-bar'>
        <h1>WORDER</h1>
      </div>
      <div className='game-top-bar'>
        <HowToPlayModalButton openModalCallback={openModalCallback} closeModalCallback={closeModalCallback} />
        <GiveUpModalButton onClickYes={onLose} openModalCallback={openModalCallback} closeModalCallback={closeModalCallback} />
        <StatsModalButton gamesPlayed={gamesPlayed} wins={wins} openModalCallback={openModalCallback} closeModalCallback={closeModalCallback} />
      </div>
      <div className="game-status">{gameStatusText}</div>
      <div className="guess-board-wrapper-outer">
        <div className='guess-board-sizer'></div>
        <div className="guess-board-wrapper-inner">
          <GuessBoard guesses={guesses} wordToGuess={wordToGuess} currentGuessIndex={currentGuessIndex} gameState={gameState} afterLettersRevealCallback={afterLettersReveal}/>
        </div>
        <div className='guess-board-sizer'></div>
      </div>
      <div className="key-board-wrapper" >
        <Keyboard onLetterEntered={onLetterEntered} onBackspace={onBackspace} onGuessEntered={onGuessEntered} wordToGuess={wordToGuess} guesses={guesses} currentGuessIndex={currentGuessIndex} gameState={gameState} blockKeyboardInput={blockKeyboardInput}/>
      </div>
      <div className="game-bottom-bar">
        <footer>
          View game source code on <a href='https://github.com/liamroddy/Worder/tree/main' target='_blank' rel='noreferrer'>GitHub</a>.
          <br /><br />Warning: the dictionary for this game is sourced from<br /><a href='https://www-cs-faculty.stanford.edu/~knuth/sgb-words.txt'>https://www-cs-faculty.stanford.edu/~knuth/sgb-words.txt</a>
          <br />and may contain words that are not suitable for all audiences.
          <br />Player discretion is advised.
        </footer>
      </div>

      <GameOverModal gamesPlayed={gamesPlayed} wins={wins} onClickYes={newGame} wordToGuess={wordToGuess} isModalOpenExternal={isGameOverModalOpen} openModalCallback={openModalCallback} closeModalCallback={closeModalCallback} />
      <WinModal gamesPlayed={gamesPlayed} currentGuessIndex={currentGuessIndex} wins={wins} onClickYes={newGame} wordToGuess={wordToGuess} isModalOpenExternal={isWinModalOpen} openModalCallback={openModalCallback} closeModalCallback={closeModalCallback} />
    </div>
  );
}
