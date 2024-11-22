import React, { useCallback, useEffect, useState, useRef } from 'react'
import styles from './FlappyBird.module.css'
import Bird from '../Bird'
import Pipe from '../Pipe'
import GameOver from '../Status/GameOver'
import ForStart from '../Status/ForStart'
import Countdown from '../Status/Countdown'
import Title from '../Title'
import { useGameContext } from '../../context/GameContext'

// 游戏常量
const GRAVITY = 0.3
const JUMP_STRENGTH = -7
const PIPE_WIDTH = 50
const PIPE_GAP = 200
const PIPE_SPACING = 300
const GAME_HEIGHT = 600
const GAME_WIDTH = 400
const INITIAL_PIPE_POSITION = 300
const INITIAL_PIPE_SPEED = 1.5
const SPEED_INCREASE = 0.01
const SCORE_TO_INCREASE_SPEED = 6

const FlappyBird = () => {
  const {GameStatus, currentGameStatus, changeGameStatus} = useGameContext()

  // 游戏状态存储
  const gameStateRef = useRef({
    isGameOver: false,
    shouldStartCountdown: false
  })

  const [letter, setLetter] = useState(getRandomLetter())
  const [birdPosition, setBirdPosition] = useState(GAME_HEIGHT / 2 - 80)
  const [birdVelocity, setBirdVelocity] = useState(0)
  const [pipes, setPipes] = useState([{position: INITIAL_PIPE_POSITION, height: 300}])
  const [score, setScore] = useState(0)
  const [throughCount, setThroughCount] = useState(0)
  const [countdown, setCountdown] = useState(3)
  // 用户行为
  const [userAction, setUserAction] = useState([])

  function getRandomLetter() {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26))
  }

  const calculatePipeSpeed = useCallback((currentScore) => {
    return INITIAL_PIPE_SPEED + SPEED_INCREASE * Math.floor(currentScore / SCORE_TO_INCREASE_SPEED)
  }, [])

  const addPipe = useCallback(() => {
    const dislocation = Math.random() * 160 + 20
    const pipeHeight = Math.random() * (GAME_HEIGHT - PIPE_GAP - 200) + dislocation
    setPipes(pipes => [...pipes, {position: GAME_WIDTH, height: pipeHeight}])
  }, [])

  // 处理游戏结束的逻辑
  const handleGameOver = useCallback(() => {
    if (!gameStateRef.current.isGameOver) {
      gameStateRef.current.isGameOver = true
      // 使用 setTimeout 确保状态更新在渲染周期之外
      setTimeout(() => {
        changeGameStatus(GameStatus.GAME_OVER)
      }, 0)
    }
  }, [GameStatus.GAME_OVER, changeGameStatus])

  // 开始新游戏
  const newGame = useCallback(() => {
    gameStateRef.current.isGameOver = false
    setBirdPosition(GAME_HEIGHT / 2 - 80)
    setBirdVelocity(0)
    setPipes([{position: INITIAL_PIPE_POSITION, height: 300}])
    setScore(0)
    setThroughCount(0)
    setCountdown(3)
    setUserAction([])

    // 使用 setTimeout 延迟状态更新
    setTimeout(() => {
      changeGameStatus(GameStatus.COUNTDOWN)
    }, 0)
  }, [GameStatus.COUNTDOWN, changeGameStatus])

  // 跳跃动作
  const jump = useCallback(() => {
    if (currentGameStatus === GameStatus.PLAYING) {
      setBirdVelocity(JUMP_STRENGTH)
      setScore(prevScore => prevScore + 1)
      const newLetter = getRandomLetter()
      setLetter(newLetter)
      // 用户行为
      const action = {
        action: 'jump',
        letter: newLetter,
        time: new Date().getTime()
      }
      setUserAction(prev => [...prev, action])
    }
  }, [currentGameStatus])

  // 键盘事件监听
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault()
        if (currentGameStatus === GameStatus.NOT_STARTED || currentGameStatus === GameStatus.GAME_OVER) {
          newGame()
        }
      } else if (e.key.toLowerCase() === letter.toLowerCase() && currentGameStatus === GameStatus.PLAYING) {
        jump()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentGameStatus, letter, jump, newGame])

  // 倒计时效果
  useEffect(() => {
    let countdownInterval
    if (currentGameStatus === GameStatus.COUNTDOWN && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // 使用 setTimeout 确保状态更新在渲染周期之外
            setTimeout(() => {
              changeGameStatus(GameStatus.PLAYING)
            }, 0)
            return 0
          }
          return prev - 1
        })
      }, 800)
    }

    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval)
      }
    }
  }, [currentGameStatus, countdown, GameStatus.PLAYING, changeGameStatus])

  // 主游戏循环
  useEffect(() => {
    if (currentGameStatus !== GameStatus.PLAYING) return

    const gameLoop = setInterval(() => {
      setBirdPosition(prevPosition => {
        const newPosition = prevPosition + birdVelocity
        if (newPosition > GAME_HEIGHT || newPosition < 0) {
          handleGameOver()
          return prevPosition
        }
        return newPosition
      })

      setBirdVelocity(prevVelocity => prevVelocity + GRAVITY)

      setPipes(prevPipes => {
        const currentPipeSpeed = calculatePipeSpeed(score)
        const BIRD_SIZE = 50
        const BIRD_LEFT = 50

        const newPipes = prevPipes
            .map(pipe => ({...pipe, position: pipe.position - currentPipeSpeed}))
            .filter(pipe => pipe.position > -PIPE_WIDTH)

        // 碰撞检测
        const birdRight = BIRD_LEFT + BIRD_SIZE
        const birdBottom = birdPosition + BIRD_SIZE

        for(let pipe of newPipes) {
          if (
              birdRight > pipe.position &&
              BIRD_LEFT < pipe.position + PIPE_WIDTH &&
              (birdPosition < pipe.height || birdBottom > pipe.height + PIPE_GAP)
          ) {
            handleGameOver()
            return newPipes
          }
        }

        // 添加新管道
        if (newPipes.length > 0 && GAME_WIDTH - newPipes[newPipes.length - 1].position >= PIPE_SPACING) {
          setTimeout(() => {
            addPipe()
          }, 0)
        }

        // 更新分数
        if (newPipes.length > 0 && newPipes[0].position <= BIRD_LEFT && newPipes[0].position > BIRD_LEFT - currentPipeSpeed) {
          setTimeout(() => {
            setScore(prevScore => prevScore + 3)
            setThroughCount(prevCount => prevCount + 1)
            const action = {
              action: 'through',
              time: new Date().getTime()
            }
            setUserAction(prev => [...prev, action])
          }, 0)
        }

        return newPipes
      })
    }, 16)

    return () => clearInterval(gameLoop)
  }, [
    currentGameStatus,
    birdPosition,
    birdVelocity,
    score,
    addPipe,
    calculatePipeSpeed,
    handleGameOver
  ])

  return (
      <div>
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
          {currentGameStatus === GameStatus.PLAYING && (
              <div className={styles.score}>
                <span>得分: {score}</span>
                <span>穿过: {throughCount}</span>
              </div>
          )}
          {currentGameStatus === GameStatus.NOT_STARTED && <Title/>}
          {currentGameStatus === GameStatus.COUNTDOWN && <Countdown count={countdown}/>}
          {currentGameStatus === GameStatus.GAME_OVER && (
              <GameOver score={score} passedCount={throughCount} userAction={userAction}/>
          )}
          {currentGameStatus === GameStatus.NOT_STARTED && (
              <ForStart className={styles.startGame} message={'按下空格开始游戏...'}/>
          )}
        </div>
      </div>
  )
}

export default FlappyBird
