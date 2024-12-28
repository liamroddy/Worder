export const NUMBER_OF_LETTERS_IN_WORD = 5;
export const NUMBER_OF_GUESSES_ALLOWED = 5;

export const AnimationTimings = {
  REVEAL_DURATION: 150, // ms
  REVEAL_DELAY: 200,
  GUESSING_PULSE_DURATION: 1000,
  GUESSING_PULSE_DELAY: 0,
  TOTAL_REVEAL_DURATION: 0
}
// hacky to redefine like this, but can't define using REVEAL_DURATION and REVEAL_DELAY until AnimationTimings is defined
AnimationTimings.TOTAL_REVEAL_DURATION = (NUMBER_OF_LETTERS_IN_WORD * AnimationTimings.REVEAL_DELAY) + AnimationTimings.REVEAL_DURATION;

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
};

export const GameState = {
  GUESSING: 1,
  REVEALING: 2,
  WON: 3,   
  LOST: 4
};

export const GameStatusText = {
  GUESSING: <span>Enter a guess!<br></br>Use a keyboard or click the letters below</span>,
  BLANK: '',
  NOT_IN_DICTIONARY: 'Word not in dictionary!',
  TOO_SHORT: 'Guess too short!',
  REVEALING: 'Hmmm......'
};
