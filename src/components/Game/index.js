import React, { useCallback, useEffect, useState } from 'react'
import styles from './Game.module.css'
import Bird from '../Bird'
import Pipe from '../Pipe'

const GRAVITY = 0.5
const JUMP_STRENGTH = -10
const PIPE_WIDTH = 50
const PIPE_GAP = 200
const COUNTDOWN_TIME = 3 // 倒计时3秒

const FlappyBird = () => {
  const [letter, setLetter] = useState(String.fromCharCode(65 + Math.floor(Math.random() * 26)))
  const [birdPosition, setBirdPosition] = useState(300)
  const [birdVelocity, setBirdVelocity] = useState(0)
  const [pipePosition, setPipePosition] = useState(400)
  const [score, setScore] = useState(0)
  // 0: 未开始, 1: 倒计时, 2: 进行中, 3: 结束
  const [gameStatus, setGameStatus] = useState(0)
  const [countdown, setCountdown] = useState(COUNTDOWN_TIME)

  const pipeHeight = 300

  const newGame = () => {
    setBirdPosition(300)
    setBirdVelocity(0)
    setPipePosition(400)
    setScore(0)
    setGameStatus(1) // 开始倒计时
    setCountdown(COUNTDOWN_TIME)
  }

  const jump = useCallback(() => {
    if (gameStatus === 2) {
      setBirdVelocity(JUMP_STRENGTH)
      setLetter(String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    }
  }, [gameStatus])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Spacer') {
        e.preventDefault()
        if (gameStatus === 0 || gameStatus === 3) {
          newGame()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [gameStatus])

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
    if (gameStatus === 1) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval)
            setGameStatus(2) // 倒计时结束，开始游戏
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(countdownInterval)
    }
  }, [gameStatus])

  useEffect(() => {
    if (gameStatus !== 2) return

    const gameLoop = setInterval(() => {
      setBirdPosition((prevPosition) => {
        const newPosition = prevPosition + birdVelocity
        if (newPosition > 600 || newPosition < 0) {
          setGameStatus(3)
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
        setGameStatus(3)
      }
    }, 20)

    return () => {
      clearInterval(gameLoop)
    }
  }, [birdPosition, birdVelocity, pipePosition, gameStatus])

  return (
      <>
        <div className={styles.gameContainer}>
          <Bird letter={letter} top={birdPosition}/>
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
          {gameStatus === 1 && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '48px',
                color: 'white',
                textAlign: 'center'
              }}>
                {countdown}
              </div>
          )}
          {gameStatus === 3 && (
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
          {gameStatus === 0 && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '24px',
                color: 'white',
                textAlign: 'center'
              }}>
                按下空格开始游戏
              </div>
          )}
        </div>
      </>
  )
}

export default FlappyBird
