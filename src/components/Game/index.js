import React, { useCallback, useEffect, useState } from 'react'
import styles from './Game.module.css'
import Bird from '../Bird'
import Pipe from '../Pipe'

const GRAVITY = 0.5
const JUMP_STRENGTH = -10
const PIPE_WIDTH = 50
const PIPE_GAP = 200

const FlappyBird = () => {
  const [letter, setLetter] = useState('J')
  const [birdPosition, setBirdPosition] = useState(300)
  const [birdVelocity, setBirdVelocity] = useState(0)
  const [pipePosition, setPipePosition] = useState(400)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const pipeHeight = 300

  const jump = useCallback(() => {
    if (!gameOver) {
      setBirdVelocity(JUMP_STRENGTH)
      setLetter(String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    }
  }, [gameOver])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key.toLowerCase() === letter.toLowerCase()) jump()
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [letter, jump])

  useEffect(() => {
    if (gameOver) return

    const gameLoop = setInterval(() => {
      setBirdPosition((prevPosition) => {
        const newPosition = prevPosition + birdVelocity
        if (newPosition > 600 || newPosition < 0) {
          setGameOver(true)
          return prevPosition
        }
        return newPosition
      })

      setBirdVelocity((prevVelocity) => prevVelocity + GRAVITY)

      setPipePosition((prevPosition) => {
        if (prevPosition < -PIPE_WIDTH) {
          setScore((prevScore) => prevScore + 1)
          return 400
        }
        return prevPosition - 2
      })

      // 碰撞检测
      if (
          pipePosition < 90 &&
          pipePosition > 10 &&
          (birdPosition < pipeHeight || birdPosition > pipeHeight + PIPE_GAP)
      ) {
        setGameOver(true)
      }
    }, 20)

    return () => {
      clearInterval(gameLoop)
    }
  }, [birdPosition, birdVelocity, pipePosition, gameOver])

  return (
      <>
        <div className={styles.gameContainer}>
          <Bird
              letter={letter}
              top={birdPosition}
          />
          <Pipe
              width={PIPE_WIDTH}
              top={0}
              height={pipeHeight}
              left={`${pipePosition}px`}
          />
          <Pipe
              width={PIPE_WIDTH}
              top={pipeHeight + PIPE_GAP}
              height={600 - pipeHeight - PIPE_GAP}
              left={`${pipePosition}px`}
          />
          <div className={styles.score}>{score}</div>
          {gameOver && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '24px',
                color: 'white',
                textAlign: 'center'
              }}>
                游戏结束<br/>
                分数: {score}<br/>
                重新开始
              </div>
          )}
        </div>
      </>
  )
}

export default FlappyBird
