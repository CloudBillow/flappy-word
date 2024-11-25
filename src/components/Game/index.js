import React, { useState } from 'react';
import FlappyBird from '../FlappyBird';
import styles from '../Game/Game.module.css';
import RankList from '../Rank/RankList';
import RankButton from '../Rank/RankButton';
import { useGameContext } from '../../context/GameContext';
import LoginForm from '../LoginForm';

const Game = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { GameStatus, currentGameStatus, isLogin } = useGameContext();

  const toggleModal = (isOpen) => setIsModalOpen(isOpen);

  const shouldShowRankButton = isLogin && (
      currentGameStatus === GameStatus.GAME_OVER ||
      currentGameStatus === GameStatus.NOT_STARTED
  );

  const renderGameContent = () => {
    if (!isLogin) {
      return <LoginForm />;
    }

    return (
        <>
          {shouldShowRankButton && (
              <RankButton onClick={() => toggleModal(true)} />
          )}
          <FlappyBird />
          <RankList
              isOpen={isModalOpen}
              onClose={() => toggleModal(false)}
          />
        </>
    );
  };

  return (
      <div className={styles.gameContainer}>
        {renderGameContent()}
      </div>
  );
};

export default Game;
