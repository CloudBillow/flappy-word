import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './Game.module.css'
import Bird from '../Bird'
import Pipe from '../Pipe'
import GameOver from '../Status/GameOver'
import NotStart from '../Status/NotStart'
import Countdown from '../Status/Countdown'
import Title from '../Title'

// 游戏常量
const GRAVITY = 0.3 // 重力
const JUMP_STRENGTH = -7 // 跳跃力度
const PIPE_WIDTH = 50 // 管道宽度
const PIPE_GAP = 200
const PIPE_SPACING = 300
const GAME_HEIGHT = 600
const GAME_WIDTH = 400
const INITIAL_PIPE_POSITION = 300
const INITIAL_PIPE_SPEED = 1.5 // 管道移动速度
const SPEED_INCREASE = 0.01 // 管道移动速度增加幅度
const SCORE_TO_INCREASE_SPEED = 6 // 每多少分增加一次速度

// 游戏状态
const GameStatus = {
  NOT_STARTED: 0,
  COUNTDOWN: 1,
  PLAYING: 2,
  GAME_OVER: 3
}

const FlappyBird = () => {

  const [letter, setLetter] = useState(getRandomLetter())
  const [birdPosition, setBirdPosition] = useState(GAME_HEIGHT / 2)
  const [birdVelocity, setBirdVelocity] = useState(0)
  const [pipes, setPipes] = useState([{position: INITIAL_PIPE_POSITION, height: 300}])
  const [score, setScore] = useState(0)
  const [passedCount, setPassedCount] = useState(0)
  const [gameStatus, setGameStatus] = useState(GameStatus.NOT_STARTED)
  const [pipeSpeed, setPipeSpeed] = useState(INITIAL_PIPE_SPEED)

  const countdownRef = useRef()

  // 计算当前管道速度
  const calculatePipeSpeed = useCallback((currentScore) => {
    return INITIAL_PIPE_SPEED + SPEED_INCREASE * Math.floor(currentScore / SCORE_TO_INCREASE_SPEED)
  }, [])

  const handleResetCountdown = () => {
    if (countdownRef.current) {
      countdownRef.current.resetCountdown() // 重置倒计时
    }
  }

  const handleSetCountdown = (value) => {
    countdownRef.current.setCountdown(value) // 设置倒计时为10
  }

  // 生成随机字母
  function getRandomLetter() {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26))
  }

  // 添加新的管道
  const addPipe = useCallback(() => {
    // 错位
    const dislocation = Math.random() * 160 + 20
    const pipeHeight = Math.random() * (GAME_HEIGHT - PIPE_GAP - 200) + dislocation
    setPipes(pipes => [...pipes, {position: GAME_WIDTH, height: pipeHeight}])
  }, [])

  // 开始新游戏
  const newGame = useCallback(() => {
    setBirdPosition(GAME_HEIGHT / 2)
    setBirdVelocity(0)
    setPipes([{position: INITIAL_PIPE_POSITION, height: 300}])  // 保持初始管道不变
    setScore(0)
    setPassedCount(0)
    setGameStatus(GameStatus.COUNTDOWN)
    handleResetCountdown()
  }, [])

  // 鸟跳跃
  const jump = useCallback(() => {
    if (gameStatus === GameStatus.PLAYING) {
      setBirdVelocity(JUMP_STRENGTH)
      setScore(prevScore => prevScore + 1)
      setLetter(getRandomLetter())
    }
  }, [gameStatus])

  // 键盘事件监听
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Space') {
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
        handleSetCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval)
            setGameStatus(GameStatus.PLAYING)
            // 当倒计时结束时，不改变管道位置，让它从原位置开始移动
            return 0
          }
          return prev - 1
        })
      }, 800)

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

      const BIRD_SIZE = 50; // 鸟的新尺寸
      const BIRD_LEFT = 50; // 鸟的固定左侧位置

      // 更新鸟的速度
      setBirdVelocity((prevVelocity) => prevVelocity + GRAVITY)

      // 更新管道位置
      setPipes(prevPipes => {
        const currentPipeSpeed = calculatePipeSpeed(score)
        const newPipes = prevPipes
            .map(pipe => ({...pipe, position: pipe.position - currentPipeSpeed}))
            .filter(pipe => pipe.position > -PIPE_WIDTH)

        const birdRight = BIRD_LEFT + BIRD_SIZE;
        const birdBottom = birdPosition + BIRD_SIZE;

        for (let pipe of newPipes) {
          if (
              birdRight > pipe.position &&
              BIRD_LEFT < pipe.position + PIPE_WIDTH &&
              (birdPosition < pipe.height || birdBottom > pipe.height + PIPE_GAP)
          ) {
            setGameStatus(GameStatus.GAME_OVER);
            return newPipes; // 立即返回以停止游戏循环
          }
        }

        // 添加新管道
        if (newPipes.length > 0 && GAME_WIDTH - newPipes[newPipes.length - 1].position >= PIPE_SPACING) {
          addPipe()
        }

        // 更新分数
        if (newPipes.length > 0 && newPipes[0].position <= BIRD_LEFT && newPipes[0].position > BIRD_LEFT - currentPipeSpeed) {
          setScore(prevScore => prevScore + 3)
          setPassedCount(prevCount => prevCount + 1)
        }

        return newPipes
      })
    }, 16)

    return () => clearInterval(gameLoop)
  }, [birdPosition, birdVelocity, pipes, gameStatus, addPipe, score, calculatePipeSpeed])

  // 渲染游戏界面
  return (
      <div className={styles.gameContainer}>
        <div className={styles.gameElements}>
          <Bird letter={letter} top={birdPosition}/>
          {pipes.map((pipe, index) => (
              <React.Fragment key={index}>
                <Pipe
                    width={PIPE_WIDTH}
                    top={0}
                    height={pipe.height}
                    left={`${pipe.position}px`}
                    isTop={true}
                />
                <Pipe
                    width={PIPE_WIDTH}
                    top={pipe.height + PIPE_GAP}
                    height={GAME_HEIGHT - pipe.height - PIPE_GAP}
                    left={`${pipe.position}px`}
                    isTop={false}
                />
              </React.Fragment>
          ))}
        </div>
        <div className={styles.uiElements}>
          {gameStatus === GameStatus.PLAYING && (
              <div className={styles.score}>
                <span>得分: {score}</span>
                <span>通过: {passedCount}</span>
              </div>
          )}
          {gameStatus === GameStatus.NOT_STARTED && (
              <Title/>
          )}
          {gameStatus === GameStatus.COUNTDOWN && (
              <Countdown ref={countdownRef}/>
          )}
          {gameStatus === GameStatus.GAME_OVER && (
              <GameOver
                  score={score}
                  passedCount={passedCount}
              />
          )}
          {gameStatus === GameStatus.NOT_STARTED && (
              <NotStart/>
          )}
        </div>
      </div>
  )
}

export default FlappyBird
