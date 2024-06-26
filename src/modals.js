import React, { useState } from 'react';
import Modal from 'react-modal';
import { UIColours } from './consts';
import { GuessSquare } from './GuessBoard';

Modal.setAppElement('#root')

export const GenericModal = ({title, body, onClickYes, buttonTextYes, buttonTextNo, showTriggerButton, isModalOpenExternal, openModalCallback, closeModalCallback}) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        openModalCallback();
        setModalIsOpen(true);
    }

    const closeModal = () => {
        closeModalCallback();
        setModalIsOpen(false);
    }

    const onThisClickYes = () => {
        closeModal();
        onClickYes();
    }

    return (
        <>      
        {showTriggerButton && <button onClick={openModal}>{title}</button>}
        <Modal 
            isOpen={modalIsOpen || isModalOpenExternal} 
            onRequestClose={closeModal}
            className="modal"
            overlayClassName={{
                base: 'ReactModal__Overlay',
                afterOpen: 'ReactModal__Overlay--after-open',
                beforeClose: 'ReactModal__Overlay--before-close'
            }}
        >
            <h2>{title}</h2>
            {body}
            {onClickYes && buttonTextYes && <button onClick={onThisClickYes}>{buttonTextYes}</button>}
            {buttonTextNo && <button onClick={closeModal}>{buttonTextNo}</button>}
        </Modal>
        </>
    );
}

const getStatsBody = (gamesPlayed, wins) => {
    const gamesWon = Object.values(wins).reduce((a, b) => a + b, 0);
    const gamesLost = gamesPlayed - gamesWon;
    const largestNumberOfWins = Math.max(...Object.values(wins));
    
    return (
        <>
          <p><strong>Games Played:</strong> {gamesPlayed}</p>
          <p><strong>Lost:</strong> {gamesLost}</p>
          <p><strong>Won:</strong> {gamesWon}</p>
          <h3>Wins breakdown:</h3>
          <div className='bar-chart-container'>
            {gamesWon === 0 ? (
                <div className="bar-chart-blank">
                <p>No wins yet!</p>
                </div>
            ) : (
                <>
                {Object.entries(wins).map(([guesses, winCount], index) => (
                    <div className='bar-container-outer' key={index}>
                    <div className='bar-container-inner'>
                        <div className='bar-chart-bar-sizer' style={{height: `${gamesWon === 0 ? "100%" : (100-((winCount/largestNumberOfWins)*100))}%`}}></div>
                        <div className='bar-chart-bar' style={{height: `${gamesWon === 0 ? 0 : (winCount/largestNumberOfWins)*100}%`}}></div>
                    </div>
                    <span className="bar-chart-label">{parseInt(guesses) + 1}</span>
                    </div>
                ))}
                </>
            )}
          </div>
        </>
    );
}

export const GiveUpModalButton = ({onClickYes, openModalCallback, closeModalCallback}) => (
    <GenericModal 
        title="Give Up" 
        body={<p>Are you sure?</p>} 
        onClickYes={onClickYes} 
        buttonTextYes="Yes" 
        buttonTextNo="No"
        showTriggerButton={true}
        openModalCallback={openModalCallback}
        closeModalCallback={closeModalCallback}
    />
);

export const GameOverModal = ({gamesPlayed, wins, onClickYes, wordToGuess, isModalOpenExternal, openModalCallback, closeModalCallback}) => (
    <GenericModal 
        title="Game Over" 
        body={<>
        <p>Sorry! The word was <strong>{wordToGuess}</strong>.</p>
        <h2>Stats:</h2>
            {getStatsBody(gamesPlayed, wins)}
        <h2>Try again?</h2>
        </>}
        onClickYes={onClickYes} 
        buttonTextYes="New Game"
        isModalOpenExternal={isModalOpenExternal}
        openModalCallback={openModalCallback}
        closeModalCallback={closeModalCallback}
    />
);

export const WinModal = ({gamesPlayed, currentGuessIndex, wins, onClickYes, wordToGuess, isModalOpenExternal, openModalCallback, closeModalCallback}) => (
    <GenericModal 
        title="Nice One!" 
        body={<>
            <p>Congrats, you correctly guessed the word <strong>{wordToGuess}</strong> in <strong>{parseInt(currentGuessIndex) + 1}</strong> guesses.</p>
            <h2>Stats:</h2>
                {getStatsBody(gamesPlayed, wins)}
            <h2>Play again?</h2>
            </>}
        onClickYes={onClickYes} 
        buttonTextYes="New Game"
        isModalOpenExternal={isModalOpenExternal}
        openModalCallback={openModalCallback}
        closeModalCallback={closeModalCallback}
    />
);

export const StatsModalButton = ({gamesPlayed, wins, openModalCallback, closeModalCallback}) => (
    <GenericModal 
        title="Statistics" 
        body={getStatsBody(gamesPlayed, wins)}
        buttonTextNo="Close"
        showTriggerButton={true}
        openModalCallback={openModalCallback}
        closeModalCallback={closeModalCallback}
    />
);

export const HowToPlayModalButton = ({openModalCallback, closeModalCallback}) => (
    <GenericModal 
        title="How to Play" 
        body={
            <>
            <p>You must guess the 5 letter word within 5 turns.</p>
            <p>When you enter a guess the tiles change colour to show how close you were.</p>
            <div className="guess-board-wrapper-outer" style={{margin : "-20px auto"}}>
                <div className='guess-board-sizer' ></div>
                    <div className="guess-board-wrapper-inner">
                        <div className='guess-board-row'>
                            <GuessSquare
                                key={1}
                                value={"H"}
                                animationDelay={-1}
                                colours={UIColours.INCORRECT_GUESS_SQUARE} />
                            <GuessSquare
                                key={1}
                                value={"E"}
                                animationDelay={-1}
                                colours={UIColours.INCORRECT_GUESS_SQUARE} />
                            <GuessSquare
                                key={1}
                                value={"L"}
                                animationDelay={-1}
                                colours={UIColours.INCORRECT_GUESS_SQUARE} />
                            <GuessSquare
                                key={1}
                                value={"L"}
                                animationDelay={-1}
                                colours={UIColours.INCORRECT_GUESS_SQUARE} />
                            <GuessSquare
                                key={1}
                                value={"O"}
                                animationDelay={-1}
                                colours={UIColours.ALMOST_CORRECT_GUESS} />
                        </div>
                    </div>
                <div className='guess-board-sizer'></div>
            </div>
            <p>An <span style={{color: UIColours.ALMOST_CORRECT_GUESS.background}}>orange</span> square indicates that the letter is in the word, but not in that position.</p>
            {/* <p>A white square indicates that the letter isn't in the word at all.</p> */}
            <div className="guess-board-wrapper-outer" style={{margin : "-20px auto"}}>
                <div className='guess-board-sizer'></div>
                    <div className="guess-board-wrapper-inner">
                        <div className='guess-board-row'>
                            <GuessSquare
                                key={1}
                                value={"W"}
                                animationDelay={-1}
                                colours={UIColours.INCORRECT_GUESS_SQUARE} />
                            <GuessSquare
                                key={1}
                                value={"O"}
                                animationDelay={-1}
                                colours={UIColours.CORRECT_GUESS} />
                            <GuessSquare
                                key={1}
                                value={"R"}
                                animationDelay={-1}
                                colours={UIColours.INCORRECT_GUESS_SQUARE} />
                            <GuessSquare
                                key={1}
                                value={"L"}
                                animationDelay={-1}
                                colours={UIColours.INCORRECT_GUESS_SQUARE} />
                            <GuessSquare
                                key={1}
                                value={"D"}
                                animationDelay={-1}
                                colours={UIColours.INCORRECT_GUESS_SQUARE} />
                        </div>
                    </div>
                <div className='guess-board-sizer'></div>
            </div>
            <p>And a <span style={{color: UIColours.CORRECT_GUESS.background}}>green</span> square indicates that you got the correct letter in the correct position.</p>
            </>
        } 
        buttonTextNo="Close"
        showTriggerButton={true}
        openModalCallback={openModalCallback}
        closeModalCallback={closeModalCallback}
    />
);
