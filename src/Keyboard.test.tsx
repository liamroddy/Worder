import { render, screen, fireEvent } from '@testing-library/react';
import { Keyboard } from './Keyboard';
import { GameState, NUMBER_OF_GUESSES_ALLOWED, NUMBER_OF_LETTERS_IN_WORD, type Guesses } from './consts';

// Mock react-spring
jest.mock('react-spring', () => ({
  useSpring: (config: any) => {
    if (typeof config === 'function') {
      return config();
    }
    return config.to || config.from || {};
  },
  animated: {
    button: 'button',
  },
}));

describe('Keyboard', () => {
  const mockOnLetterEntered = jest.fn();
  const mockOnBackspace = jest.fn();
  const mockOnGuessEntered = jest.fn();
  const wordToGuess = 'HELLO';

  const createEmptyGuesses = (): Guesses => 
    new Array(NUMBER_OF_GUESSES_ALLOWED)
      .fill(null)
      .map(() => new Array(NUMBER_OF_LETTERS_IN_WORD).fill(null));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all letter keys', () => {
    const guesses = createEmptyGuesses();
    render(
      <Keyboard
        onLetterEntered={mockOnLetterEntered}
        onBackspace={mockOnBackspace}
        onGuessEntered={mockOnGuessEntered}
        wordToGuess={wordToGuess}
        guesses={guesses}
        currentGuessIndex={0}
        gameState={GameState.GUESSING}
        blockKeyboardInput={false}
      />
    );

    const letters = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('');
    letters.forEach(letter => {
      expect(screen.getByText(letter)).toBeInTheDocument();
    });
  });

  it('should render ENTER and backspace keys', () => {
    const guesses = createEmptyGuesses();
    render(
      <Keyboard
        onLetterEntered={mockOnLetterEntered}
        onBackspace={mockOnBackspace}
        onGuessEntered={mockOnGuessEntered}
        wordToGuess={wordToGuess}
        guesses={guesses}
        currentGuessIndex={0}
        gameState={GameState.GUESSING}
        blockKeyboardInput={false}
      />
    );

    expect(screen.getByText('ENTER')).toBeInTheDocument();
    expect(screen.getByText('←')).toBeInTheDocument();
  });

  it('should call onLetterEntered when letter key is clicked', () => {
    const guesses = createEmptyGuesses();
    render(
      <Keyboard
        onLetterEntered={mockOnLetterEntered}
        onBackspace={mockOnBackspace}
        onGuessEntered={mockOnGuessEntered}
        wordToGuess={wordToGuess}
        guesses={guesses}
        currentGuessIndex={0}
        gameState={GameState.GUESSING}
        blockKeyboardInput={false}
      />
    );

    const qButton = screen.getByText('Q');
    fireEvent.click(qButton);
    expect(mockOnLetterEntered).toHaveBeenCalledWith('Q');
  });

  it('should call onBackspace when backspace key is clicked', () => {
    const guesses = createEmptyGuesses();
    render(
      <Keyboard
        onLetterEntered={mockOnLetterEntered}
        onBackspace={mockOnBackspace}
        onGuessEntered={mockOnGuessEntered}
        wordToGuess={wordToGuess}
        guesses={guesses}
        currentGuessIndex={0}
        gameState={GameState.GUESSING}
        blockKeyboardInput={false}
      />
    );

    const backspaceButton = screen.getByText('←');
    fireEvent.click(backspaceButton);
    expect(mockOnBackspace).toHaveBeenCalled();
  });

  it('should call onGuessEntered when ENTER key is clicked', () => {
    const guesses = createEmptyGuesses();
    render(
      <Keyboard
        onLetterEntered={mockOnLetterEntered}
        onBackspace={mockOnBackspace}
        onGuessEntered={mockOnGuessEntered}
        wordToGuess={wordToGuess}
        guesses={guesses}
        currentGuessIndex={0}
        gameState={GameState.GUESSING}
        blockKeyboardInput={false}
      />
    );

    const enterButton = screen.getByText('ENTER');
    fireEvent.click(enterButton);
    expect(mockOnGuessEntered).toHaveBeenCalled();
  });

  it('should handle physical keyboard input for letters', () => {
    const guesses = createEmptyGuesses();
    render(
      <Keyboard
        onLetterEntered={mockOnLetterEntered}
        onBackspace={mockOnBackspace}
        onGuessEntered={mockOnGuessEntered}
        wordToGuess={wordToGuess}
        guesses={guesses}
        currentGuessIndex={0}
        gameState={GameState.GUESSING}
        blockKeyboardInput={false}
      />
    );

    fireEvent.keyUp(window, { key: 'a' });
    expect(mockOnLetterEntered).toHaveBeenCalledWith('A');
  });

  it('should handle physical keyboard input for Backspace', () => {
    const guesses = createEmptyGuesses();
    render(
      <Keyboard
        onLetterEntered={mockOnLetterEntered}
        onBackspace={mockOnBackspace}
        onGuessEntered={mockOnGuessEntered}
        wordToGuess={wordToGuess}
        guesses={guesses}
        currentGuessIndex={0}
        gameState={GameState.GUESSING}
        blockKeyboardInput={false}
      />
    );

    fireEvent.keyUp(window, { key: 'Backspace' });
    expect(mockOnBackspace).toHaveBeenCalled();
  });

  it('should handle physical keyboard input for Enter', () => {
    const guesses = createEmptyGuesses();
    render(
      <Keyboard
        onLetterEntered={mockOnLetterEntered}
        onBackspace={mockOnBackspace}
        onGuessEntered={mockOnGuessEntered}
        wordToGuess={wordToGuess}
        guesses={guesses}
        currentGuessIndex={0}
        gameState={GameState.GUESSING}
        blockKeyboardInput={false}
      />
    );

    fireEvent.keyUp(window, { key: 'Enter' });
    expect(mockOnGuessEntered).toHaveBeenCalled();
  });

  it('should block keyboard input when blockKeyboardInput is true', () => {
    const guesses = createEmptyGuesses();
    render(
      <Keyboard
        onLetterEntered={mockOnLetterEntered}
        onBackspace={mockOnBackspace}
        onGuessEntered={mockOnGuessEntered}
        wordToGuess={wordToGuess}
        guesses={guesses}
        currentGuessIndex={0}
        gameState={GameState.GUESSING}
        blockKeyboardInput={true}
      />
    );

    fireEvent.keyUp(window, { key: 'a' });
    expect(mockOnLetterEntered).not.toHaveBeenCalled();
  });

  it('should ignore non-letter keys', () => {
    const guesses = createEmptyGuesses();
    render(
      <Keyboard
        onLetterEntered={mockOnLetterEntered}
        onBackspace={mockOnBackspace}
        onGuessEntered={mockOnGuessEntered}
        wordToGuess={wordToGuess}
        guesses={guesses}
        currentGuessIndex={0}
        gameState={GameState.GUESSING}
        blockKeyboardInput={false}
      />
    );

    fireEvent.keyUp(window, { key: '1' });
    fireEvent.keyUp(window, { key: '!' });
    fireEvent.keyUp(window, { key: 'Shift' });
    expect(mockOnLetterEntered).not.toHaveBeenCalled();
  });
});
