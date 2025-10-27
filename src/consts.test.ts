import { GameState, GameStatusText, NUMBER_OF_GUESSES_ALLOWED, NUMBER_OF_LETTERS_IN_WORD, AnimationTimings, UIColours } from './consts';

describe('Constants', () => {
  describe('NUMBER_OF_LETTERS_IN_WORD', () => {
    it('should be 5', () => {
      expect(NUMBER_OF_LETTERS_IN_WORD).toBe(5);
    });
  });

  describe('NUMBER_OF_GUESSES_ALLOWED', () => {
    it('should be 5', () => {
      expect(NUMBER_OF_GUESSES_ALLOWED).toBe(5);
    });
  });

  describe('GameState', () => {
    it('should have correct values', () => {
      expect(GameState.GUESSING).toBe(1);
      expect(GameState.REVEALING).toBe(2);
      expect(GameState.WON).toBe(3);
      expect(GameState.LOST).toBe(4);
    });
  });

  describe('AnimationTimings', () => {
    it('should have correct static values', () => {
      expect(AnimationTimings.REVEAL_DURATION).toBe(150);
      expect(AnimationTimings.REVEAL_DELAY).toBe(200);
      expect(AnimationTimings.GUESSING_PULSE_DURATION).toBe(1000);
      expect(AnimationTimings.GUESSING_PULSE_DELAY).toBe(0);
    });

    it('should calculate TOTAL_REVEAL_DURATION correctly', () => {
      const expected = (NUMBER_OF_LETTERS_IN_WORD * AnimationTimings.REVEAL_DELAY) + AnimationTimings.REVEAL_DURATION;
      expect(AnimationTimings.TOTAL_REVEAL_DURATION).toBe(expected);
      expect(AnimationTimings.TOTAL_REVEAL_DURATION).toBe(1150);
    });
  });

  describe('UIColours', () => {
    it('should have DEFAULT colors', () => {
      expect(UIColours.DEFAULT).toEqual({
        text: 'ivory',
        background: '#111a1f'
      });
    });

    it('should have GUESSING colors', () => {
      expect(UIColours.GUESSING).toEqual({
        text: 'ivory',
        background: '#3b4863'
      });
    });

    it('should have CORRECT_GUESS colors', () => {
      expect(UIColours.CORRECT_GUESS).toEqual({
        text: '#111a1f',
        background: '#4ab19d'
      });
    });

    it('should have ALMOST_CORRECT_GUESS colors', () => {
      expect(UIColours.ALMOST_CORRECT_GUESS).toEqual({
        text: '#111a1f',
        background: '#e17a47'
      });
    });

    it('should have INCORRECT_GUESS_SQUARE colors', () => {
      expect(UIColours.INCORRECT_GUESS_SQUARE).toEqual({
        text: 'ivory',
        background: '#111a1f'
      });
    });

    it('should have INCORRECT_GUESS_KEY colors', () => {
      expect(UIColours.INCORRECT_GUESS_KEY).toEqual({
        text: 'ivory',
        background: '#45545b'
      });
    });
  });

  describe('GameStatusText', () => {
    it('should have BLANK status', () => {
      expect(GameStatusText.BLANK).toBe('');
    });

    it('should have NOT_IN_DICTIONARY status', () => {
      expect(GameStatusText.NOT_IN_DICTIONARY).toBe('Word not in dictionary!');
    });

    it('should have TOO_SHORT status', () => {
      expect(GameStatusText.TOO_SHORT).toBe('Guess too short!');
    });

    it('should have REVEALING status', () => {
      expect(GameStatusText.REVEALING).toBe('Hmmm......');
    });
  });
});
