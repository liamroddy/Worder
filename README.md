# Worder: a word-guessing game

A fun word-guessing game inspired by New York Times' Wordle game: https://www.nytimes.com/games/wordle.

The key difference is that Worder is Harder!

It has more obscure words, a mixture of regional spellings (e.g. "METRE" and "METER" are both in the dictionary!), and fewer attempts at guessing allowed!

Worder can also be played infinitely - no waiting for 'tomorrow's Wordle'.

[Click here to play!](https://liamroddy.github.io/Worder/)

## The Technical Stuff

This project features a responsive and accessible interface that should look good and play well on any device - from mobile phones to desktop computers.

### Tech Stack
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **React** - Component-based UI framework
- **react-spring** - Smooth animations
- **react-modal** - Accessible modal dialogs

### Dictionary Source
The game's word list was sourced from [Stanford GraphBase](https://www-cs-faculty.stanford.edu/~knuth/sgb-words.txt), which includes a mix of regional spellings and more challenging vocabulary.

## Development and Deployment

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn package manager

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/liamroddy/Worder.git
cd Worder
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

This will start the Vite dev server on `http://localhost:3000` with hot module replacement enabled.

### Build

Create a production build:

```bash
npm run build
```

This command:
1. Runs TypeScript compiler to check for type errors
2. Builds the project using Vite
3. Outputs optimized files to the `dist/` directory

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Deploy to GitHub Pages

This project is configured to deploy to GitHub Pages automatically. To deploy:

```bash
npm run deploy
```

This command:
1. Runs `npm run build` (via the `predeploy` script)
2. Deploys the `dist/` directory to the `gh-pages` branch
3. The site will be available at `https://liamroddy.github.io/Worder/`

**Important Configuration Notes:**
- The `base` path in `vite.config.ts` is set to `/Worder/` to match the GitHub Pages repository name
- The `homepage` field in `package.json` points to the GitHub Pages URL
- If you fork this project, update both of these values to match your repository name

### Other Useful Commands

Check for linting errors:
```bash
npm run lint
```

Auto-fix linting errors:
```bash
npm run lint:fix
```

Type check without building:
```bash
npm run type-check
```

## How to Play:

You can play using your touchscreen device, or with a keyboard and mouse.

You have to guess the word in 5 attempts.

Each guess you make has to be a valid 5-letter word.

When you enter your guess the tiles will change colour to show how close you were to the correct answer.

### Examples:

![second-letter-is-O-and-green](README_resources/letter_in_correct_spot.png)

O is in the word, and in the correct spot. B, A, R and D aren't in the word.

![first-letter-is-A-and-orange](README_resources/letter_in_incorrect_spot.png)

A is in the word, but it's not the first letter in the word. P, L and E aren't in the word.

## The Game in Action:

https://github.com/liamroddy/Worder/assets/38569656/b43b7666-bac1-456a-923f-6415656df15d
