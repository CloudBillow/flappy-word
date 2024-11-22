import './App.css'
import Game from './components/Game'
import { GameProvider } from './context/GameContext'

function App() {
  // 版本信息
  console.log(
      '%c Flappy Bird v1.0.0',
      'color: #fff; background: #6EBEC8; padding: 5px; border-radius: 5px'
  )
  return (
      <div className="App">
        <GameProvider>
          <Game/>
        </GameProvider>
      </div>
  )
}

export default App
