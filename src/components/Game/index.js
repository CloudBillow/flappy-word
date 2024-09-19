import React, { useCallback, useEffect, useState } from 'react'
import styles from './Game.module.css'
import Bird from '../Bird'
import Pipe from '../Pipe'

// 游戏常量
const GRAVITY = 0.5
const JUMP_STRENGTH = -10
const PIPE_WIDTH = 50
const PIPE_GAP = 200
const PIPE_SPACING = 300
const COUNTDOWN_TIME = 3
const GAME_HEIGHT = 600
const GAME_WIDTH = 400
const INITIAL_PIPE_POSITION = 300

// 游戏状态枚举
const GameStatus = {
  NOT_STARTED: 0,
  COUNTDOWN: 1,
  PLAYING: 2,
  GAME_OVER: 3
}

const FlappyBird = () => {
  // 状态变量
  const [letter, setLetter] = useState(getRandomLetter())
  const [birdPosition, setBirdPosition] = useState(GAME_HEIGHT / 2)
  const [birdVelocity, setBirdVelocity] = useState(0)
  const [pipes, setPipes] = useState([{position: INITIAL_PIPE_POSITION, height: 300}])
  const [score, setScore] = useState(0)
  const [gameStatus, setGameStatus] = useState(GameStatus.NOT_STARTED)
  const [countdown, setCountdown] = useState(COUNTDOWN_TIME)

  // 生成随机字母
  function getRandomLetter() {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26))
  }

  // 添加新的管道
  const addPipe = useCallback(() => {
    const pipeHeight = Math.random() * (GAME_HEIGHT - PIPE_GAP - 200) + 100
    setPipes(pipes => [...pipes, {position: GAME_WIDTH, height: pipeHeight}])
  }, [])

  // 开始新游戏
  const newGame = useCallback(() => {
    setBirdPosition(GAME_HEIGHT / 2)
    setBirdVelocity(0)
    setPipes([{position: INITIAL_PIPE_POSITION, height: 300}])  // 保持初始管道不变
    setScore(0)
    setGameStatus(GameStatus.COUNTDOWN)
    setCountdown(COUNTDOWN_TIME)
  }, [])

  // 鸟跳跃
  const jump = useCallback(() => {
    if (gameStatus === GameStatus.PLAYING) {
      setBirdVelocity(JUMP_STRENGTH)
      setLetter(getRandomLetter())
    }
  }, [gameStatus])

  // 键盘事件监听
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault()
        if (gameStatus === GameStatus.NOT_STARTED || gameStatus === GameStatus.GAME_OVER) {
          newGame()
        }
      } else if (e.key.toLowerCase() === letter.toLowerCase() && gameStatus === GameStatus.PLAYING) {
        jump()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameStatus, letter, jump, newGame])

  // 倒计时效果
  useEffect(() => {
    if (gameStatus === GameStatus.COUNTDOWN) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval)
            setGameStatus(GameStatus.PLAYING)
            // 当倒计时结束时，不改变管道位置，让它从原位置开始移动
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(countdownInterval)
    }
  }, [gameStatus])

  // 主游戏循环
  useEffect(() => {
    if (gameStatus !== GameStatus.PLAYING) return

    const gameLoop = setInterval(() => {
      // 更新鸟的位置
      setBirdPosition((prevPosition) => {
        const newPosition = prevPosition + birdVelocity
        if (newPosition > GAME_HEIGHT || newPosition < 0) {
          setGameStatus(GameStatus.GAME_OVER)
          return prevPosition
        }
        return newPosition
      })

      // 更新鸟的速度
      setBirdVelocity((prevVelocity) => prevVelocity + GRAVITY)

      // 更新管道位置
      setPipes(prevPipes => {
        const newPipes = prevPipes
            .map(pipe => ({...pipe, position: pipe.position - 2}))
            .filter(pipe => pipe.position > -PIPE_WIDTH)

        // 添加新管道
        if (newPipes.length > 0 && GAME_WIDTH - newPipes[newPipes.length - 1].position >= PIPE_SPACING) {
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
          setGameStatus(GameStatus.GAME_OVER)
        }
      })
    }, 20)

    return () => clearInterval(gameLoop)
  }, [birdPosition, birdVelocity, pipes, gameStatus, addPipe])

  // 渲染游戏界面
  return (
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
                  height={GAME_HEIGHT - pipe.height - PIPE_GAP}
                  left={`${pipe.position}px`}
              />
            </React.Fragment>
        ))}
        <div className={styles.score}>{score}</div>
        {gameStatus === GameStatus.COUNTDOWN && (
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
        {gameStatus === GameStatus.GAME_OVER && (
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
        {gameStatus === GameStatus.NOT_STARTED && (
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
  )
}

export default FlappyBird
