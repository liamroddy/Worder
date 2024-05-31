# Worder: a word-guessing game

A fun word-guessing game inspired by New York Times' Wordle game: https://www.nytimes.com/games/wordle
The key difference is that Worder is Harder!
It has more obscure words, a mixture of regional spellings (e.g. "METRE" and "METER" are both in the dictionary!), and fewer attempts at guessing allowed!

Worder can also be played infinitely - no waiting for 'tomorrow's Wordle'.

This project was built using just React, react-spring, and react-modal.

The dictionary for the game was sourced from https://www-cs-faculty.stanford.edu/~knuth/sgb-words.txt

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

https://github.com/liamroddy/Worder/assets/38569656/359993f2-f7cc-4803-a818-7a3e6da37e7b
