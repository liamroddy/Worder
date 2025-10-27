import React from 'react';

export const NUMBER_OF_LETTERS_IN_WORD = 5;
export const NUMBER_OF_GUESSES_ALLOWED = 5;

export const AnimationTimings = {
  REVEAL_DURATION: 150, // ms
  REVEAL_DELAY: 200,
  GUESSING_PULSE_DURATION: 1000,
  GUESSING_PULSE_DELAY: 0,
  get TOTAL_REVEAL_DURATION(): number {
    return (NUMBER_OF_LETTERS_IN_WORD * this.REVEAL_DELAY) + this.REVEAL_DURATION;
  }
};

export const UIColours = {
  DEFAULT: {
    text: 'ivory',
    background: '#111a1f'
  },
  GUESSING: {
    text: 'ivory',
    background: '#3b4863'
  },
  CORRECT_GUESS: {
    text: '#111a1f',
    background: '#4ab19d'
  },
  ALMOST_CORRECT_GUESS: {
    text: '#111a1f',
    background: '#e17a47'
  },
  INCORRECT_GUESS_SQUARE: {
    text: 'ivory',
    background: '#111a1f'
  },
  INCORRECT_GUESS_KEY: {
    text: 'ivory',
    background: '#45545b'
  }
} as const;

export enum GameState {
  GUESSING = 1,
  REVEALING = 2,
  WON = 3,   
  LOST = 4
}

export const GameStatusText = {
  GUESSING: React.createElement('span', null, 
    'Enter a guess!',
    React.createElement('br'),
    'Use a keyboard or click the letters below'
  ),
  BLANK: '',
  NOT_IN_DICTIONARY: 'Word not in dictionary!',
  TOO_SHORT: 'Guess too short!',
  REVEALING: 'Hmmm......'
};

// Type definitions
export type Guess = (string | null)[];
export type Guesses = Guess[];
export type GameStatistics = {
  gamesPlayed: number;
  wins: number[];
};

export type ModalCallbacks = {
  openModalCallback: () => void;
  closeModalCallback: () => void;
};