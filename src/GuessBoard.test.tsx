import { render, screen } from '@testing-library/react';
import { GuessBoard } from './GuessBoard';
import { GameState, NUMBER_OF_GUESSES_ALLOWED, NUMBER_OF_LETTERS_IN_WORD, type Guesses } from './consts';

// Mock react-spring to avoid animation issues in tests
jest.mock('react-spring', () => ({
  useSpring: (config: any) => {
    if (typeof config === 'function') {
      return config();
    }
    return config.to || config.from || {};
  },
  animated: {
    div: 'div',
  },
}));

describe('GuessBoard', () => {
  const mockAfterLettersReveal = jest.fn();
  const wordToGuess = 'HELLO';

  const createEmptyGuesses = (): Guesses => 
    new Array(NUMBER_OF_GUESSES_ALLOWED)
      .fill(null)
      .map(() => new Array(NUMBER_OF_LETTERS_IN_WORD).fill(null));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty board', () => {
    const guesses = createEmptyGuesses();
    const { container } = render(
      <GuessBoard
        guesses={guesses}
        wordToGuess={wordToGuess}
        currentGuessIndex={0}
        gameState={GameState.GUESSING}
        afterLettersRevealCallback={mockAfterLettersReveal}
      />
    );

    const squares = container.querySelectorAll('.guess-square');
    expect(squares).toHaveLength(NUMBER_OF_GUESSES_ALLOWED * NUMBER_OF_LETTERS_IN_WORD);
  });

  it('should render guesses with letters', () => {
    const guesses = createEmptyGuesses();
    guesses[0] = ['H', 'E', 'L', 'L', 'O'];

    render(
      <GuessBoard
        guesses={guesses}
        wordToGuess={wordToGuess}
        currentGuessIndex={1}
        gameState={GameState.GUESSING}
        afterLettersRevealCallback={mockAfterLettersReveal}
      />
    );

    expect(screen.getByText('H')).toBeInTheDocument();
    expect(screen.getByText('E')).toBeInTheDocument();
    expect(screen.getAllByText('L')).toHaveLength(2);
    expect(screen.getByText('O')).toBeInTheDocument();
  });

  it('should render partial guess on current row', () => {
    const guesses = createEmptyGuesses();
    guesses[0] = ['H', 'E', 'L', null, null];

    render(
      <GuessBoard
        guesses={guesses}
        wordToGuess={wordToGuess}
        currentGuessIndex={0}
        gameState={GameState.GUESSING}
        afterLettersRevealCallback={mockAfterLettersReveal}
      />
    );

    expect(screen.getByText('H')).toBeInTheDocument();
    expect(screen.getByText('E')).toBeInTheDocument();
    expect(screen.getByText('L')).toBeInTheDocument();
  });

  it('should render correct number of rows', () => {
    const guesses = createEmptyGuesses();
    const { container } = render(
      <GuessBoard
        guesses={guesses}
        wordToGuess={wordToGuess}
        currentGuessIndex={0}
        gameState={GameState.GUESSING}
        afterLettersRevealCallback={mockAfterLettersReveal}
      />
    );

    const rows = container.querySelectorAll('.guess-board-row');
    expect(rows).toHaveLength(NUMBER_OF_GUESSES_ALLOWED);
  });

  it('should handle multiple guesses', () => {
    const guesses = createEmptyGuesses();
    guesses[0] = ['W', 'O', 'R', 'D', 'S'];
    guesses[1] = ['H', 'E', 'L', 'L', 'O'];

    render(
      <GuessBoard
        guesses={guesses}
        wordToGuess={wordToGuess}
        currentGuessIndex={2}
        gameState={GameState.GUESSING}
        afterLettersRevealCallback={mockAfterLettersReveal}
      />
    );

    expect(screen.getByText('W')).toBeInTheDocument();
    expect(screen.getAllByText('O')).toHaveLength(2); // 'O' appears twice
    expect(screen.getByText('R')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('H')).toBeInTheDocument();
  });
});
