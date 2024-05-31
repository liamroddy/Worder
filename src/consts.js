export const NUMBER_OF_LETTERS_IN_WORD = 5;
export const NUMBER_OF_GUESSES_ALLOWED = 5;

export const AnimationTimings = {
  REVEAL_DURATION: 150, // ms
  REVEAL_DELAY: 200,
  TOTAL_REVEAL_DURATION: 0
}
// hacky to redefine like this, but can't define using REVEAL_DURATION and REVEAL_DELAY until AnimationTimings is defined
AnimationTimings.TOTAL_REVEAL_DURATION = (NUMBER_OF_LETTERS_IN_WORD * AnimationTimings.REVEAL_DELAY) + AnimationTimings.REVEAL_DURATION;

export const UIColours = {
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
