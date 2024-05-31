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

export const GameOverModal = ({onClickYes, wordToGuess, isModalOpenExternal, openModalCallback, closeModalCallback}) => (
    <GenericModal 
        title="Game Over" 
        body={<p>Sorry! The word was <strong>{wordToGuess}</strong>.<br></br>Try again?</p>}
        onClickYes={onClickYes} 
        buttonTextYes="New Game"
        isModalOpenExternal={isModalOpenExternal}
        openModalCallback={openModalCallback}
        closeModalCallback={closeModalCallback}
    />
);

export const WinModal = ({onClickYes, wordToGuess, isModalOpenExternal, openModalCallback, closeModalCallback}) => (
    <GenericModal 
        title="Nice One!" 
        body={<p>Congrats, you correctly guessed the word <strong>{wordToGuess}</strong>.<br></br>Try again?</p>}
        onClickYes={onClickYes} 
        buttonTextYes="New Game"
        isModalOpenExternal={isModalOpenExternal}
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
            <p>You can enter guesses your touchscreen device, or with a keyboard and mouse.</p>
            <p>When you enter a guess the tiles will change colour to show how close you were to the word.</p>
            <div className="guess-board-wrapper-outer">
                <div className='guess-board-sizer'></div>
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
            <div className="guess-board-wrapper-outer">
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
            <p>And a <span style={{color: UIColours.CORRECT_GUESS.background}}>green</span> square indicates that the letter is in the word, and in that position.</p>
            </>
        } 
        buttonTextNo="Close"
        showTriggerButton={true}
        openModalCallback={openModalCallback}
        closeModalCallback={closeModalCallback}
    />
);
