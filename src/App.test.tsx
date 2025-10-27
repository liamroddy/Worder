import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock react-spring
jest.mock('react-spring', () => ({
  useSpring: (config: any) => {
    if (typeof config === 'function') {
      return config();
    }
    return config.to || config.from || {};
  },
  animated: {
    div: 'div',
    button: 'button',
  },
}));

// Mock react-modal
jest.mock('react-modal', () => {
  const Modal = ({ children, isOpen }: any) => {
    return isOpen ? <div data-testid="modal">{children}</div> : null;
  };
  Modal.setAppElement = jest.fn();
  return Modal;
});

// Mock js-confetti
jest.mock('js-confetti', () => {
  return jest.fn().mockImplementation(() => ({
    addConfetti: jest.fn(),
  }));
});

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    // Mock console.log to suppress the cheat warning
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render the game title', () => {
    render(<App />);
    expect(screen.getByText('WORDER')).toBeInTheDocument();
  });

  it('should render the guess board', () => {
    const { container } = render(<App />);
    const guessBoard = container.querySelector('.guess-board');
    expect(guessBoard).toBeInTheDocument();
  });

  it('should render the keyboard', () => {
    const { container } = render(<App />);
    const keyboard = container.querySelector('.key-board');
    expect(keyboard).toBeInTheDocument();
  });

  it('should render initial game status', () => {
    render(<App />);
    expect(screen.getByText(/Enter a guess!/i)).toBeInTheDocument();
  });

  it('should add letter when keyboard key is clicked', () => {
    const { container } = render(<App />);
    
    const qButton = screen.getByText('Q');
    fireEvent.click(qButton);

    const squares = container.querySelectorAll('.guess-square');
    expect(squares[0]).toHaveTextContent('Q');
  });

  it('should add letters sequentially', () => {
    const { container } = render(<App />);
    
    const hButton = screen.getByText('H');
    const eButton = screen.getByText('E');
    
    fireEvent.click(hButton);
    fireEvent.click(eButton);

    const squares = container.querySelectorAll('.guess-square');
    expect(squares[0]).toHaveTextContent('H');
    expect(squares[1]).toHaveTextContent('E');
  });

  it('should remove letter when backspace is clicked', () => {
    const { container } = render(<App />);
    
    const hButton = screen.getByText('H');
    const backspaceButton = screen.getByText('←');
    
    fireEvent.click(hButton);
    fireEvent.click(backspaceButton);

    const squares = container.querySelectorAll('.guess-square');
    expect(squares[0]).toHaveTextContent('');
  });

  it('should show error message for short guess', () => {
    render(<App />);
    
    const hButton = screen.getByText('H');
    const enterButton = screen.getByText('ENTER');
    
    fireEvent.click(hButton);
    fireEvent.click(enterButton);

    expect(screen.getByText('Guess too short!')).toBeInTheDocument();
  });

  it('should show error message for word not in dictionary', () => {
    render(<App />);
    
    // Enter a 5-letter word that's not in dictionary
    const letters = ['X', 'X', 'X', 'X', 'X'];
    letters.forEach(letter => {
      // Get all buttons with this letter and click the keyboard one
      const buttons = screen.getAllByText(letter);
      // Find the button element (keyboard key, not guess square div)
      const button = buttons.find(el => el.tagName === 'BUTTON');
      if (button) {
        fireEvent.click(button);
      }
    });

    const enterButton = screen.getByText('ENTER');
    fireEvent.click(enterButton);

    expect(screen.getByText('Word not in dictionary!')).toBeInTheDocument();
  });

  it('should accept valid dictionary word', async () => {
    render(<App />);
    
    // Use a word from the dictionary that has unique letters
    const word = 'SWORD'; // Known word from dictionary
    const letters = word.split('');
    letters.forEach(letter => {
      const buttons = screen.getAllByText(letter.toUpperCase());
      // Click the first matching button (from keyboard, not board)
      fireEvent.click(buttons[0]);
    });

    const enterButton = screen.getByText('ENTER');
    fireEvent.click(enterButton);

    // Should show revealing status instead of error
    await waitFor(() => {
      expect(screen.queryByText('Word not in dictionary!')).not.toBeInTheDocument();
      expect(screen.queryByText('Guess too short!')).not.toBeInTheDocument();
    });
  });

  it('should limit guess to 5 letters', () => {
    const { container } = render(<App />);
    
    const hButton = screen.getByText('H');
    
    // Try to add 6 letters
    for (let i = 0; i < 6; i++) {
      fireEvent.click(hButton);
    }

    const squares = container.querySelectorAll('.guess-square');
    const firstRowSquares = Array.from(squares).slice(0, 5);
    const filledSquares = firstRowSquares.filter(square => square.textContent === 'H');
    
    // Should only have 5 letters
    expect(filledSquares).toHaveLength(5);
  });

  it('should render footer with GitHub link', () => {
    render(<App />);
    const githubLink = screen.getByText(/View game source code on/i);
    expect(githubLink).toBeInTheDocument();
  });

  it('should initialize game statistics in localStorage', () => {
    render(<App />);
    
    const stats = localStorage.getItem('gameStatistics');
    expect(stats).toBeTruthy();
    
    const parsedStats = JSON.parse(stats!);
    expect(parsedStats).toHaveProperty('gamesPlayed');
    expect(parsedStats).toHaveProperty('wins');
  });

  it('should handle physical keyboard input', () => {
    const { container } = render(<App />);
    
    fireEvent.keyUp(window, { key: 'h' });

    const squares = container.querySelectorAll('.guess-square');
    expect(squares[0]).toHaveTextContent('H');
  });

  it('should handle physical backspace key', () => {
    const { container } = render(<App />);
    
    fireEvent.keyUp(window, { key: 'h' });
    fireEvent.keyUp(window, { key: 'Backspace' });

    const squares = container.querySelectorAll('.guess-square');
    expect(squares[0]).toHaveTextContent('');
  });
});
