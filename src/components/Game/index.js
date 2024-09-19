import React, { useCallback, useEffect, useState } from 'react'
import styles from './Game.module.css'
import Bird from '../Bird'
import Pipe from '../Pipe'

const GRAVITY = 0.5
const JUMP_STRENGTH = -10
const PIPE_WIDTH = 50
const PIPE_GAP = 200
const PIPE_SPACING = 300 // 管道之间的水平间距
const COUNTDOWN_TIME = 3 // 倒计时3秒

const FlappyBird = () => {
  const [letter, setLetter] = useState(String.fromCharCode(65 + Math.floor(Math.random() * 26)))
  const [birdPosition, setBirdPosition] = useState(300)
  const [birdVelocity, setBirdVelocity] = useState(0)
  const [pipes, setPipes] = useState([])
  const [score, setScore] = useState(0)
  // 0: 未开始, 1: 倒计时, 2: 进行中, 3: 结束
  const [gameStatus, setGameStatus] = useState(0)
  const [countdown, setCountdown] = useState(COUNTDOWN_TIME)

  const addPipe = () => {
    const pipeHeight = Math.random() * (400 - PIPE_GAP) + 100
    setPipes(pipes => [...pipes, {position: 400, height: pipeHeight}])
  }

  const newGame = () => {
    setBirdPosition(300)
    setBirdVelocity(0)
    setPipes([{position: 300, height: 300}])
    setScore(0)
    setGameStatus(1) // 开始倒计时
    setCountdown(COUNTDOWN_TIME)
  }

  useEffect(() => {
    if (gameStatus === 0) {
      setPipes([{position: 300, height: 300}])
    }
  }, [gameStatus])

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

      setPipes(prevPipes => {
        const newPipes = prevPipes
            .map(pipe => ({...pipe, position: pipe.position - (score ? 2 * score : 2)}))
            .filter(pipe => pipe.position > -PIPE_WIDTH)

        if (newPipes.length > 0 && 400 - newPipes[newPipes.length - 1].position >= PIPE_SPACING) {
          addPipe()
        }

        // 更新分数
        if (newPipes.length > 0 && newPipes[0].position === 48) {
          setScore(prevScore => prevScore + 1)
        }

        return newPipes
      })

      // 碰撞检测
      pipes.forEach(pipe => {
        if (
            pipe.position < 90 &&
            pipe.position > 10 &&
            (birdPosition < pipe.height || birdPosition > pipe.height + PIPE_GAP)
        ) {
          setGameStatus(3)
        }
      })
    }, 20)

    return () => {
      clearInterval(gameLoop)
    }
  }, [birdPosition, birdVelocity, pipes, gameStatus, score])

  return (
      <>
        <div className={styles.gameContainer}>
          <Bird letter={letter} top={birdPosition}/>
          {pipes.map((pipe, index) => (
              <React.Fragment key={index}>
                <Pipe
                    width={PIPE_WIDTH}
                    top={0}
                    height={pipe.height}
                    left={`${pipe.position}px`}
                />
                <Pipe
                    width={PIPE_WIDTH}
                    top={pipe.height + PIPE_GAP}
                    height={600 - pipe.height - PIPE_GAP}
                    left={`${pipe.position}px`}
                />
              </React.Fragment>
          ))}
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
