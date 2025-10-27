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

  describe('LocalStorage - Saving and Loading', () => {
    it('should initialize with default stats when localStorage is empty', () => {
      render(<App />);
      
      const stats = localStorage.getItem('gameStatistics');
      expect(stats).toBeTruthy();
      
      const parsedStats = JSON.parse(stats!);
      expect(parsedStats.gamesPlayed).toBe(0);
      expect(parsedStats.wins).toEqual([0, 0, 0, 0, 0]);
    });

    it('should load existing stats from localStorage on mount', () => {
      const existingStats = {
        gamesPlayed: 10,
        wins: [1, 2, 3, 2, 1]
      };
      localStorage.setItem('gameStatistics', JSON.stringify(existingStats));
      
      render(<App />);
      
      // Stats should be loaded and displayed
      const statsButton = screen.getByText('Statistics');
      fireEvent.click(statsButton);
      
      expect(screen.getByText(/Games Played:/)).toBeInTheDocument();
      expect(screen.getByText(/10/)).toBeInTheDocument();
    });

    it('should save stats to localStorage after a win', async () => {
      render(<App />);
      
      // Simulate winning by entering the correct word
      // First we need to know what word was chosen
      const consoleLogSpy = jest.spyOn(console, 'log');
      
      // Get the word from console.log output
      const logCalls = consoleLogSpy.mock.calls;
      const wordLog = logCalls.find(call => 
        call[0]?.includes('If you (hypothetically) were')
      );
      
      // Extract word from the log message
      const wordMatch = wordLog?.[0].match(/would be (\w+)/);
      const word = wordMatch?.[1];
      
      if (word) {
        // Enter the correct word
        word.split('').forEach((letter: string) => {
          fireEvent.keyUp(window, { key: letter.toLowerCase() });
        });
        
        const enterButton = screen.getByText('ENTER');
        fireEvent.click(enterButton);
        
        // Wait for the game to process the win
        await waitFor(() => {
          const stats = localStorage.getItem('gameStatistics');
          const parsedStats = JSON.parse(stats!);
          expect(parsedStats.gamesPlayed).toBe(1);
          expect(parsedStats.wins.reduce((a: number, b: number) => a + b, 0)).toBe(1);
        }, { timeout: 3000 });
      }
    });

    it('should save stats to localStorage after giving up', () => {
      render(<App />);
      
      const giveUpButton = screen.getByText('Give Up');
      fireEvent.click(giveUpButton);
      
      // Click Yes on the modal
      const yesButton = screen.getByText('Yes');
      fireEvent.click(yesButton);
      
      const stats = localStorage.getItem('gameStatistics');
      const parsedStats = JSON.parse(stats!);
      
      expect(parsedStats.gamesPlayed).toBe(1);
      expect(parsedStats.wins).toEqual([0, 0, 0, 0, 0]);
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem('gameStatistics', 'invalid json');
      
      // Spy on console.error to verify error handling
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<App />);
      
      // Should fall back to defaults
      const stats = localStorage.getItem('gameStatistics');
      const parsedStats = JSON.parse(stats!);
      
      expect(parsedStats.gamesPlayed).toBe(0);
      expect(parsedStats.wins).toEqual([0, 0, 0, 0, 0]);
      
      // Should log error
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to load'),
        expect.anything()
      );
      
      consoleErrorSpy.mockRestore();
    });

    it('should handle invalid gamesPlayed type in localStorage', () => {
      const invalidStats = {
        gamesPlayed: 'not a number',
        wins: [1, 2, 3, 2, 1]
      };
      localStorage.setItem('gameStatistics', JSON.stringify(invalidStats));
      
      render(<App />);
      
      // Should use default value for gamesPlayed
      const stats = localStorage.getItem('gameStatistics');
      const parsedStats = JSON.parse(stats!);
      
      // After re-render, it should save with default gamesPlayed
      expect(parsedStats.gamesPlayed).toBe(0);
    });

    it('should handle invalid wins array in localStorage', () => {
      const invalidStats = {
        gamesPlayed: 5,
        wins: [1, 2, 3] // Wrong length
      };
      localStorage.setItem('gameStatistics', JSON.stringify(invalidStats));
      
      render(<App />);
      
      // Should use default value for wins
      const stats = localStorage.getItem('gameStatistics');
      const parsedStats = JSON.parse(stats!);
      
      expect(parsedStats.wins).toEqual([0, 0, 0, 0, 0]);
    });

    it('should handle non-array wins in localStorage', () => {
      const invalidStats = {
        gamesPlayed: 5,
        wins: 'not an array'
      };
      localStorage.setItem('gameStatistics', JSON.stringify(invalidStats));
      
      render(<App />);
      
      const stats = localStorage.getItem('gameStatistics');
      const parsedStats = JSON.parse(stats!);
      
      expect(parsedStats.wins).toEqual([0, 0, 0, 0, 0]);
    });

    it('should persist stats across multiple games', async () => {
      const { unmount } = render(<App />);
      
      // Give up on first game
      const giveUpButton = screen.getByText('Give Up');
      fireEvent.click(giveUpButton);
      const yesButton = screen.getByText('Yes');
      fireEvent.click(yesButton);
      
      // Start new game
      const newGameButton = screen.getByText('New Game');
      fireEvent.click(newGameButton);
      
      // Give up on second game
      const giveUpButton2 = screen.getByText('Give Up');
      fireEvent.click(giveUpButton2);
      const yesButton2 = screen.getByText('Yes');
      fireEvent.click(yesButton2);
      
      // Unmount and remount to simulate page reload
      unmount();
      render(<App />);
      
      // Check that stats persisted
      const statsButton = screen.getByText('Statistics');
      fireEvent.click(statsButton);
      
      // Should show 2 games played
      // The stats modal shows "Games Played: 2" but in separate elements
      expect(screen.getByText(/Games Played:/)).toBeInTheDocument();
      // Look for the specific paragraph containing both text and number
      const allElements = screen.getAllByText(/./);
      const gamesPlayedElement = allElements.find(el => 
        el.textContent?.includes('Games Played:') && el.textContent?.includes('2')
      );
      expect(gamesPlayedElement).toBeDefined();
    });

    it('should update wins array at correct index based on guess number', async () => {
      localStorage.setItem('gameStatistics', JSON.stringify({
        gamesPlayed: 0,
        wins: [0, 0, 0, 0, 0]
      }));
      
      render(<App />);
      
      // Get the word to guess
      const consoleLogSpy = jest.spyOn(console, 'log');
      const logCalls = consoleLogSpy.mock.calls;
      const wordLog = logCalls.find(call => 
        call[0]?.includes('If you (hypothetically) were')
      );
      const wordMatch = wordLog?.[0].match(/would be (\w+)/);
      const word = wordMatch?.[1];
      
      if (word) {
        // Win on first guess
        word.split('').forEach((letter: string) => {
          fireEvent.keyUp(window, { key: letter.toLowerCase() });
        });
        
        const enterButton = screen.getByText('ENTER');
        fireEvent.click(enterButton);
        
        // Wait for stats to update
        await waitFor(() => {
          const stats = localStorage.getItem('gameStatistics');
          const parsedStats = JSON.parse(stats!);
          
          // Should have incremented wins[0] since we won on first guess
          expect(parsedStats.wins[0]).toBe(1);
          expect(parsedStats.wins.slice(1)).toEqual([0, 0, 0, 0]);
        }, { timeout: 3000 });
      }
    });

    it('should save stats immediately when they change', async () => {
      render(<App />);
      
      // Verify initial save
      let stats = localStorage.getItem('gameStatistics');
      let parsedStats = JSON.parse(stats!);
      expect(parsedStats.gamesPlayed).toBe(0);
      
      // Trigger a game over
      const giveUpButton = screen.getByText('Give Up');
      fireEvent.click(giveUpButton);
      const yesButton = screen.getByText('Yes');
      fireEvent.click(yesButton);
      
      // Stats should be saved immediately
      stats = localStorage.getItem('gameStatistics');
      parsedStats = JSON.parse(stats!);
      expect(parsedStats.gamesPlayed).toBe(1);
    });
  });
});
