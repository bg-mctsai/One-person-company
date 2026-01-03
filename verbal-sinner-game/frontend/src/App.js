import React, { useState } from 'react';
import Prologue from './components/Prologue';
import RevivalChoice from './components/RevivalChoice';
import Game from './components/Game';
import GameOver from './components/GameOver';
import './App.css';

const GAME_STATE = {
  PROLOGUE: 'prologue',
  REVIVAL_CHOICE: 'revival_choice',
  GAME: 'game',
  GAME_OVER: 'game_over',
};

function App() {
  const [gameState, setGameState] = useState(GAME_STATE.PROLOGUE);

  const handlePrologueFinish = () => {
    setGameState(GAME_STATE.REVIVAL_CHOICE);
  };

  const handleRevive = () => {
    setGameState(GAME_STATE.GAME);
  };

  const handleEnd = () => {
    setGameState(GAME_STATE.GAME_OVER);
  };

  const renderGameState = () => {
    switch (gameState) {
      case GAME_STATE.PROLOGUE:
        return <Prologue onFinish={handlePrologueFinish} />;
      case GAME_STATE.REVIVAL_CHOICE:
        return <RevivalChoice onRevive={handleRevive} onEnd={handleEnd} />;
      case GAME_STATE.GAME:
        return <Game />;
      case GAME_STATE.GAME_OVER:
        return <GameOver />;
      default:
        return <Prologue onFinish={handlePrologueFinish} />;
    }
  };

  return <div className="App">{renderGameState()}</div>;
}

export default App;
